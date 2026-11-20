import type { Server as HttpServer } from 'node:http';
import { GoogleGenAI, Modality, type LiveServerMessage } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

const CLSF_SYSTEM_INSTRUCTION = `You are the Senior Technical Advisor for CLSF Building Contracting in Dubai, UAE (Office 55, Tanvi Business Center, Al Maktoum Road, Port Saeed, Deira, Dubai · Tel: +971564080255 · Email: info@clsfae.com).
You advise residential and commercial clients on building contracting, G+1 villa construction, structural extensions, interior fit-out, MEP & HVAC engineering, interior finishing, and planned building maintenance (AMC).
Rules:
- Use clear, confident British English with practical technical specificity (BOQ scoping, authority NOCs, waterproofing 48-hour flood tests, 10-bar pipe pressure testing, TAB airflow balancing, snagging).
- Never claim unverified years of experience, project counts, awards, or government contracts.
- Never use exclamation marks or marketing superlatives.
- When a user needs formal pricing or an inspection, guide them to submit an enquiry via Request a Quotation (/request-a-quote) or Book a Site Visit (/site-visit).`;

const ALLOWED_CHAT_MODELS = [
  'gemini-4-hydrogen',
  'gemini-3.1-flash-lite',
  'gemini-4-neon',
  'gemini-4-carbon',
] as const;

export type AllowedChatModel = (typeof ALLOWED_CHAT_MODELS)[number];

export function isAllowedChatModel(model: string): model is AllowedChatModel {
  return (ALLOWED_CHAT_MODELS as readonly string[]).includes(model);
}

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface ChatTurnInput {
  role: 'user' | 'model';
  text: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

function extractGroundingSources(response: {
  candidates?: Array<{
    groundingMetadata?: {
      groundingChunks?: Array<{
        web?: { uri?: string; title?: string };
      }>;
    };
  }>;
}): GroundingSource[] {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const seen = new Set<string>();
  const sources: GroundingSource[] = [];
  for (const chunk of chunks) {
    const uri = chunk.web?.uri;
    if (uri && !seen.has(uri)) {
      seen.add(uri);
      sources.push({
        uri,
        title: chunk.web?.title || uri,
      });
    }
  }
  return sources;
}

export function mapGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('GEMINI_API_KEY is not configured')) {
    return {
      status: 500,
      message: 'Gemini API key is not configured. Please verify Settings > Secrets.',
    };
  }
  if (raw.includes('503') || raw.includes('UNAVAILABLE')) {
    return {
      status: 503,
      message:
        'This model is currently experiencing high demand. Please retry in a moment or switch to Fast mode (gemini-3.1-flash-lite).',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message:
        'Rate limit or tier quota reached. If using gemini-4-carbon or gemini-4-neon, select a billing-enabled API key in Settings > Secrets, or switch to gemini-3.1-flash-lite or gemini-4-hydrogen.',
    };
  }
  if (raw.includes('PERMISSION_DENIED') || raw.includes('API_KEY_INVALID') || raw.includes('403')) {
    return {
      status: 403,
      message:
        'API key permission denied for this model. Verify your Gemini API key in Settings > Secrets or switch to gemini-3.1-flash-lite.',
    };
  }
  if (raw.includes('NOT_FOUND') || raw.includes('404')) {
    return {
      status: 404,
      message: 'Requested Gemini model was not found. Please switch to gemini-4-hydrogen.',
    };
  }
  return { status: 500, message: raw || 'Unable to reach Gemini service.' };
}

async function withTransientRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    if (raw.includes('503') || raw.includes('UNAVAILABLE')) {
      await new Promise((r) => setTimeout(r, 700));
      return await fn();
    }
    throw err;
  }
}

export async function runMultiTurnChat(params: {
  messages: ChatTurnInput[];
  model: AllowedChatModel;
  useSearch: boolean;
}) {
  const ai = getGenAIClient();
  const { messages, model, useSearch } = params;
  if (messages.length === 0) {
    throw new Error('At least one user message is required.');
  }

  const latest = messages[messages.length - 1];
  if (latest.role !== 'user' || !latest.text.trim()) {
    throw new Error('Latest message must be non-empty user text.');
  }

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  const enableSearch = useSearch && model === 'gemini-4-hydrogen';

  const chat = ai.chats.create({
    model,
    history,
    config: {
      systemInstruction: CLSF_SYSTEM_INSTRUCTION,
      ...(enableSearch ? { tools: [{ googleSearch: {} }] } : {}),
    },
  });

  const response = await withTransientRetry(() =>
    chat.sendMessage({
      message: latest.text.trim(),
    })
  );

  return {
    text: response.text ?? '',
    model,
    sources: extractGroundingSources(response),
    searchGrounded: enableSearch,
  };
}

export async function runSearchGroundedLookup(query: string) {
  const ai = getGenAIClient();
  const response = await withTransientRetry(() =>
    ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: query,
      config: {
        systemInstruction:
          `${CLSF_SYSTEM_INSTRUCTION}\nProvide a concise, factual UAE/Dubai technical summary grounded in current web search sources. Cite relevant standards, authorities, or material guidance where found.`,
        tools: [{ googleSearch: {} }],
      },
    })
  );

  return {
    text: response.text ?? '',
    model: 'gemini-4-hydrogen',
    sources: extractGroundingSources(response),
  };
}

export function attachLiveVoiceWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/api/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    let session: Awaited<ReturnType<GoogleGenAI['live']['connect']>> | null = null;
    let closed = false;

    const sendJson = (payload: Record<string, unknown>) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    try {
      const ai = getGenAIClient();
      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction:
            `${CLSF_SYSTEM_INSTRUCTION}\nSpeak concisely in clear, measured British English as a Dubai construction and MEP engineering advisor. Keep spoken answers practical and direct.`,
        },
        callbacks: {
          onopen: () => {
            sendJson({ type: 'ready' });
          },
          onmessage: (message: LiveServerMessage) => {
            const content = message.serverContent;
            if (content?.inputTranscription?.text) {
              sendJson({ type: 'inputTranscript', text: content.inputTranscription.text });
            }
            if (content?.outputTranscription?.text) {
              sendJson({ type: 'outputTranscript', text: content.outputTranscription.text });
            }
            for (const part of content?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                sendJson({ type: 'audio', audio: part.inlineData.data });
              }
            }
            if (content?.interrupted) {
              sendJson({ type: 'interrupted' });
            }
            if (content?.turnComplete) {
              sendJson({ type: 'turnComplete' });
            }
          },
          onerror: (err: unknown) => {
            const mapped = mapGeminiError(err);
            sendJson({ type: 'error', message: mapped.message });
          },
          onclose: () => {
            if (!closed) {
              sendJson({ type: 'closed' });
            }
          },
        },
      });
    } catch (err) {
      const mapped = mapGeminiError(err);
      sendJson({ type: 'error', message: mapped.message });
      clientWs.close();
      return;
    }

    clientWs.on('message', (raw) => {
      if (!session) return;
      try {
        const msg = JSON.parse(raw.toString()) as { type?: string; audio?: string; text?: string };
        if (msg.audio) {
          session.sendRealtimeInput({
            audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (msg.text) {
          session.sendRealtimeInput({
            text: msg.text,
          });
        }
      } catch {
        // Ignore malformed frames
      }
    });

    clientWs.on('close', () => {
      closed = true;
      try {
        session?.close();
      } catch {
        // Ignore close errors
      }
    });
  });
}
