import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe, MessageSquare, Send, X, Zap } from 'lucide-react';
import {
  sendTechnicalChat,
  type ChatModelChoice,
  type ChatTurnMessage,
  type GroundingSource,
} from '../lib/api';

interface WidgetMessage extends ChatTurnMessage {
  id: string;
  model?: ChatModelChoice;
  sources?: GroundingSource[];
}

const QUICK_PROMPTS = [
  'How do I request a villa or fit-out quotation?',
  'What is included in your Building Maintenance AMC?',
  'Do you handle Dubai Municipality & DCD approvals?',
];

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<ChatModelChoice>('gemini-3.1-flash-lite');
  const [messages, setMessages] = useState<WidgetMessage[]>([
    {
      id: 'init-greeting',
      role: 'model',
      model: 'gemini-3.1-flash-lite',
      text: 'Welcome to CLSF Building Contracting. Ask about villa construction, interior fit-outs, MEP & HVAC works, maintenance AMC plans, or how to book a site survey.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages, loading]);

  async function sendMessage(text: string) {
    const clean = text.trim();
    if (!clean || loading) return;

    const userMsg: WidgetMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: clean,
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const apiMessages: ChatTurnMessage[] = nextHistory
        .filter((m) => m.id !== 'init-greeting')
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await sendTechnicalChat({
        messages: apiMessages,
        model,
        useSearch: model === 'gemini-4-hydrogen',
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          model: res.model,
          text: res.text,
          sources: res.sources,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach AI advisor.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open CLSF AI Chatbot"
          className="flex min-h-[48px] items-center gap-3 border border-[hsl(var(--accent))] bg-[hsl(0_0%_12%)] px-5 py-3 text-left text-[hsl(40_6%_96%)] transition-colors hover:bg-[hsl(0_0%_16%)]"
        >
          <MessageSquare className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
          <div>
            <span className="block text-[10px] font-medium uppercase leading-none tracking-[0.22em] text-[hsl(var(--accent))]">
              AI Chatbot
            </span>
            <span className="mt-1 block text-xs font-medium leading-none">
              Technical Advisor
            </span>
          </div>
        </button>
      ) : (
        <section
          aria-label="CLSF AI Chatbot"
          className="flex h-[540px] w-[380px] max-w-[calc(100vw-2rem)] flex-col border border-[hsl(var(--foreground))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[hsl(0_0%_24%)] bg-[hsl(0_0%_12%)] px-4 py-3.5 text-[hsl(40_6%_96%)]">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[hsl(var(--accent))]">
                CLSF AI Chatbot
              </p>
              <p className="mt-0.5 text-sm font-medium">Dubai Contracting Advisor</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/technical-desk"
                onClick={() => setOpen(false)}
                title="Open full AI Desk & Live Voice"
                className="inline-flex h-8 items-center gap-1 border border-[hsl(0_0%_28%)] px-2.5 text-[10px] uppercase tracking-[0.14em] text-[hsl(40_6%_90%)] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
              >
                <span>Full Desk</span>
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </Link>
              <button
                type="button"
                aria-label="Close AI Chatbot"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center border border-[hsl(0_0%_28%)] text-[hsl(40_6%_90%)] hover:border-[hsl(var(--accent))]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Model Switch Bar */}
          <div className="grid grid-cols-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[11px]">
            <button
              type="button"
              onClick={() => setModel('gemini-3.1-flash-lite')}
              className={`flex min-h-[36px] items-center justify-center gap-1.5 border-r border-[hsl(var(--border))] px-2 font-medium uppercase tracking-[0.12em] ${
                model === 'gemini-3.1-flash-lite'
                  ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              <Zap className="h-3 w-3 text-[hsl(var(--accent))]" aria-hidden="true" />
              <span>Fast Advisor</span>
            </button>
            <button
              type="button"
              onClick={() => setModel('gemini-4-hydrogen')}
              className={`flex min-h-[36px] items-center justify-center gap-1.5 px-2 font-medium uppercase tracking-[0.12em] ${
                model === 'gemini-4-hydrogen'
                  ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              <Globe className="h-3 w-3 text-[hsl(var(--accent))]" aria-hidden="true" />
              <span>Web Search</span>
            </button>
          </div>

          {/* Thread */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-[hsl(var(--background))] p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`border p-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-8 border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                    : 'mr-4 border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]'
                }`}
              >
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
                  {msg.role === 'user' ? 'You' : 'CLSF AI'}
                </p>
                <p className="whitespace-pre-line">{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 border-t border-[hsl(var(--border))] pt-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                      Sources
                    </p>
                    <ul className="mt-1 space-y-1">
                      {msg.sources.slice(0, 3).map((src) => (
                        <li key={src.uri} className="truncate">
                          <a
                            href={src.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] underline text-[hsl(var(--accent))]"
                          >
                            {src.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {messages.length === 1 && !loading && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
                  Common Questions
                </p>
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void sendMessage(q)}
                    className="block w-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-2 text-left text-xs text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--foreground))]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="mr-8 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3 text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
                Drafting response...
              </div>
            )}
            <div ref={endRef} />
          </div>

          {error && (
            <div role="alert" className="border-t border-[hsl(var(--accent))] bg-[hsl(var(--muted))] px-3 py-2 text-xs text-[hsl(var(--foreground))]">
              {error}
            </div>
          )}

          {/* Direct Quote / Site Visit Footer Strip */}
          <div className="flex items-center justify-between border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-2 text-[11px]">
            <Link
              to="/request-a-quote"
              onClick={() => setOpen(false)}
              className="font-medium uppercase tracking-[0.14em] text-[hsl(var(--accent))] hover:underline"
            >
              Submit Quote Enquiry
            </Link>
            <Link
              to="/site-visit"
              onClick={() => setOpen(false)}
              className="font-medium uppercase tracking-[0.14em] text-[hsl(var(--foreground))] hover:underline"
            >
              Book Site Visit
            </Link>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
            <label htmlFor="widget-chat-input" className="sr-only">
              Ask CLSF AI Chatbot
            </label>
            <input
              id="widget-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about scope, HVAC, AMC, or Dubai permits..."
              className="min-h-[44px] flex-1 bg-transparent px-3.5 text-xs focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex w-12 items-center justify-center bg-[hsl(var(--accent))] text-[hsl(40_6%_98%)] transition-colors hover:bg-[hsl(33_33%_39%)] disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
