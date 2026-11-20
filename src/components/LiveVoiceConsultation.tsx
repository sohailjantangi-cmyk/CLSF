import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, PhoneOff, Volume2 } from 'lucide-react';

interface TranscriptEntry {
  id: string;
  speaker: 'You' | 'CLSF Advisor';
  text: string;
}

type VoiceStatus = 'idle' | 'connecting' | 'active' | 'error';

function float32ToPcm16Base64(float32: Float32Array): string {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64Pcm16ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const sampleCount = Math.floor(bytes.byteLength / 2);
  const float32 = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    float32[i] = view.getInt16(i * 2, true) / 32768;
  }
  return float32;
}

export function LiveVoiceConsultation() {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mutedRef = useRef<boolean>(false);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  function stopPlaybackQueue() {
    for (const source of activeSourcesRef.current) {
      try {
        source.stop();
      } catch {
        // Already stopped
      }
    }
    activeSourcesRef.current = [];
    if (outputCtxRef.current) {
      nextStartTimeRef.current = outputCtxRef.current.currentTime;
    } else {
      nextStartTimeRef.current = 0;
    }
  }

  function appendTranscript(speaker: 'You' | 'CLSF Advisor', text: string) {
    const clean = text.trim();
    if (!clean) return;
    setTranscripts((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.speaker === speaker) {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          text: `${last.text} ${clean}`.trim(),
        };
        return updated;
      }
      return [...prev, { id: `${Date.now()}-${Math.random()}`, speaker, text: clean }];
    });
  }

  function cleanupSession() {
    stopPlaybackQueue();
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (inputCtxRef.current) {
      void inputCtxRef.current.close();
      inputCtxRef.current = null;
    }
    if (outputCtxRef.current) {
      void outputCtxRef.current.close();
      outputCtxRef.current = null;
    }
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      cleanupSession();
    };
  }, []);

  function schedulePcm24kAudio(base64Audio: string) {
    const ctx = outputCtxRef.current;
    if (!ctx) return;

    const samples = base64Pcm16ToFloat32(base64Audio);
    if (samples.length === 0) return;

    const audioBuffer = ctx.createBuffer(1, samples.length, 24000);
    audioBuffer.copyToChannel(samples as Float32Array<ArrayBuffer>, 0);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    if (nextStartTimeRef.current < now) {
      nextStartTimeRef.current = now;
    }
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;

    activeSourcesRef.current.push(source);
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
    };
  }

  async function startSession() {
    cleanupSession();
    setError(null);
    setStatus('connecting');
    setTranscripts([]);

    try {
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputCtxRef.current = inputCtx;
      outputCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/api/live`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data as string) as {
          type?: string;
          audio?: string;
          text?: string;
          message?: string;
        };
        if (msg.type === 'ready') {
          setStatus('active');
        } else if (msg.type === 'audio' && msg.audio) {
          schedulePcm24kAudio(msg.audio);
        } else if (msg.type === 'inputTranscript' && msg.text) {
          appendTranscript('You', msg.text);
        } else if (msg.type === 'outputTranscript' && msg.text) {
          appendTranscript('CLSF Advisor', msg.text);
        } else if (msg.type === 'interrupted') {
          stopPlaybackQueue();
        } else if (msg.type === 'error') {
          setError(msg.message || 'Live voice session encountered an error.');
          setStatus('error');
          cleanupSession();
        } else if (msg.type === 'closed') {
          setStatus('idle');
          cleanupSession();
        }
      };

      ws.onerror = () => {
        setError('Unable to establish WebSocket connection for Live voice consultation.');
        setStatus('error');
        cleanupSession();
      };

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (mutedRef.current) return;
        const activeWs = wsRef.current;
        if (!activeWs || activeWs.readyState !== WebSocket.OPEN) return;
        const channelData = e.inputBuffer.getChannelData(0);
        const base64 = float32ToPcm16Base64(channelData);
        activeWs.send(JSON.stringify({ audio: base64 }));
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Microphone access or audio context initialisation failed.'
      );
      setStatus('error');
      cleanupSession();
    }
  }

  function endSession() {
    cleanupSession();
    setStatus('idle');
  }

  return (
    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 sm:p-10">
      <div className="flex flex-col justify-between gap-6 border-b border-[hsl(var(--border))] pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="section-label">Real-Time Voice · gemini-3.8-live</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-[hsl(var(--foreground))]">
            Live Voice Technical Consultation
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[hsl(var(--muted-foreground))]">
            Speak directly with our technical advisor about Dubai villa builds, office fit-out scopes, MEP issues, or AMC schedules using real-time bidirectional audio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {status === 'idle' || status === 'error' ? (
            <button
              type="button"
              onClick={startSession}
              className="inline-flex min-h-[48px] items-center gap-2 bg-[hsl(var(--accent))] px-6 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)] transition-colors hover:bg-[hsl(33_33%_39%)]"
            >
              <Mic className="h-4 w-4" aria-hidden="true" />
              <span>Start Voice Call</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className="inline-flex min-h-[48px] items-center gap-2 border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 text-xs font-medium uppercase tracking-[0.16em]"
              >
                {muted ? (
                  <>
                    <MicOff className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
                    <span>Unmute Mic</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
                    <span>Mute Mic</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={endSession}
                className="inline-flex min-h-[48px] items-center gap-2 bg-[hsl(var(--foreground))] px-6 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))]"
              >
                <PhoneOff className="h-4 w-4" aria-hidden="true" />
                <span>End Call</span>
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-6 border border-[hsl(var(--accent))] bg-[hsl(var(--muted))] p-4 text-sm text-[hsl(var(--foreground))]">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 py-4 text-xs uppercase tracking-[0.18em]">
        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
          <span>
            Session State:{' '}
            <strong className="font-medium text-[hsl(var(--foreground))]">
              {status === 'idle' && 'Standby'}
              {status === 'connecting' && 'Connecting Audio Stream'}
              {status === 'active' && (muted ? 'Connected (Microphone Muted)' : 'Listening & Speaking Live')}
              {status === 'error' && 'Disconnected'}
            </strong>
          </span>
        </div>
        <span className="tabular-nums text-[hsl(var(--muted-foreground))]">16kHz In / 24kHz Out PCM</span>
      </div>

      <div className="mt-6 min-h-[260px] max-h-[400px] overflow-y-auto border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
        {transcripts.length === 0 ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {status === 'active'
              ? 'Microphone active. Ask your question to begin the voice conversation.'
              : 'Press Start Voice Call and allow microphone access to speak with the CLSF technical advisor.'}
          </p>
        ) : (
          <div className="space-y-4">
            {transcripts.map((entry) => (
              <div
                key={entry.id}
                className="border-b border-[hsl(var(--border))] pb-3 last:border-b-0 last:pb-0"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                  {entry.speaker}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--foreground))]">
                  {entry.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
