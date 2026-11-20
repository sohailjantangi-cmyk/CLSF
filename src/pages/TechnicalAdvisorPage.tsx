import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ExternalLink, Globe, Send, Trash2 } from 'lucide-react';
import {
  runSearchLookup,
  sendTechnicalChat,
  type ChatModelChoice,
  type ChatTurnMessage,
  type GroundingSource,
} from '../lib/api';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { LiveVoiceConsultation } from '../components/LiveVoiceConsultation';
import { CTASection } from '../components/CTASection';

interface ThreadMessage extends ChatTurnMessage {
  id: string;
  model?: ChatModelChoice;
  sources?: GroundingSource[];
}

const MODEL_OPTIONS: {
  id: ChatModelChoice;
  label: string;
  role: string;
}[] = [
  {
    id: 'gemini-4-hydrogen',
    label: 'General & Web Search',
    role: 'gemini-4-hydrogen · Standard engineering Q&A with live Google Search grounding',
  },
  {
    id: 'gemini-3.1-flash-lite',
    label: 'Fast Technical Brief',
    role: 'gemini-3.1-flash-lite · Low-latency scope summaries and checklists',
  },
  {
    id: 'gemini-4-neon',
    label: 'Complex Interactive Scope',
    role: 'gemini-4-neon · Multi-trade coordination and detailed BOQ structuring',
  },
  {
    id: 'gemini-4-carbon',
    label: 'Deep Engineering Reasoning',
    role: 'gemini-4-carbon · Root-cause MEP diagnostics and structural sequencing',
  },
];

const STARTER_PROMPTS = [
  'What approvals are required in Dubai for a G+1 villa rear extension?',
  'Compare chilled water FCUs and VRF systems for a 4,000 sq ft Business Bay office fit-out.',
  'Explain the waterproofing flood-test and screed sequence for bathroom renovations.',
  'Check current DEWA guidelines for residential EV charger circuit installations in Dubai.',
];

export function TechnicalAdvisorPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'search'>('chat');

  // Multi-turn chat state
  const [selectedModel, setSelectedModel] = useState<ChatModelChoice>('gemini-4-hydrogen');
  const [useSearch, setUseSearch] = useState(true);
  const [messages, setMessages] = useState<ThreadMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      model: 'gemini-4-hydrogen',
      text: 'Welcome to the CLSF Technical Desk. Ask about Dubai villa construction, commercial fit-out approvals, MEP/HVAC sizing, waterproofing test procedures, or building maintenance scopes.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Dedicated Search Grounding lookup state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<{
    text: string;
    sources: GroundingSource[];
  } | null>(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  async function submitChatText(text: string) {
    const clean = text.trim();
    if (!clean || chatLoading) return;

    const userMsg: ThreadMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: clean,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setChatInput('');
    setChatError(null);
    setChatLoading(true);

    try {
      // Exclude synthetic welcome greeting if it's the very first model turn before any user turn
      const apiHistory: ChatTurnMessage[] = nextMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const response = await sendTechnicalChat({
        messages: apiHistory,
        model: selectedModel,
        useSearch: selectedModel === 'gemini-4-hydrogen' && useSearch,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: response.text,
          model: response.model,
          sources: response.sources,
        },
      ]);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : 'Unable to reach technical advisor.');
    } finally {
      setChatLoading(false);
    }
  }

  function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    void submitChatText(chatInput);
  }

  async function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (!clean || searchLoading) return;
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await runSearchLookup(clean);
      setSearchResult({ text: res.text, sources: res.sources });
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search lookup failed.');
    } finally {
      setSearchLoading(false);
    }
  }

  return (
    <>
      <Seo
        title="Technical Desk & Advisory | CLSF Building Contracting Dubai"
        description="Consult CLSF's interactive Technical Desk for Dubai building contracting guidance, live Google Search regulation lookups, and real-time voice advisory."
        path="/technical-desk"
      />

      <PageHero
        label="Engineering Desk"
        title="CLSF Technical Scope & Regulation Advisor"
        intro="Explore Dubai contracting sequencing, authority permitting, MEP specifications, and maintenance planning via multi-turn chat, Google Search grounding, or live voice consultation."
        breadcrumbs={[{ label: 'Technical Desk' }]}
      />

      <section className="bg-[hsl(var(--background))] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Tab Switcher */}
          <div
            role="tablist"
            aria-label="Technical Desk modes"
            className="flex flex-wrap gap-2 border-b border-[hsl(var(--border))] pb-6"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'chat'}
              onClick={() => setActiveTab('chat')}
              className={`min-h-[44px] border px-6 text-xs font-medium uppercase tracking-[0.16em] ${
                activeTab === 'chat'
                  ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]'
              }`}
            >
              Multi-Turn Technical Chat
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'voice'}
              onClick={() => setActiveTab('voice')}
              className={`min-h-[44px] border px-6 text-xs font-medium uppercase tracking-[0.16em] ${
                activeTab === 'voice'
                  ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]'
              }`}
            >
              Live Voice Consultation
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'search'}
              onClick={() => setActiveTab('search')}
              className={`min-h-[44px] border px-6 text-xs font-medium uppercase tracking-[0.16em] ${
                activeTab === 'search'
                  ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]'
              }`}
            >
              UAE Regulations &amp; Search Lookup
            </button>
          </div>

          {activeTab === 'chat' && (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left configuration rail */}
              <aside className="space-y-6 lg:col-span-4">
                <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6">
                  <p className="section-label">Reasoning Mode</p>
                  <div className="mt-4 space-y-2">
                    {MODEL_OPTIONS.map((opt) => {
                      const active = selectedModel === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedModel(opt.id)}
                          className={`w-full border p-3.5 text-left transition-colors ${
                            active
                              ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                              : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground))]'
                          }`}
                        >
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p
                            className={`mt-1 text-xs ${
                              active ? 'text-[hsl(0_0%_74%)]' : 'text-[hsl(var(--muted-foreground))]'
                            }`}
                          >
                            {opt.role}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 border-t border-[hsl(var(--border))] pt-5">
                    <label className="flex cursor-pointer items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={useSearch}
                        disabled={selectedModel !== 'gemini-4-hydrogen'}
                        onChange={(e) => setUseSearch(e.target.checked)}
                        className="mt-1"
                      />
                      <span>
                        <span className="block font-medium text-[hsl(var(--foreground))]">
                          Google Search Grounding
                        </span>
                        <span className="mt-1 block text-xs text-[hsl(var(--muted-foreground))]">
                          Active with gemini-4-hydrogen to cite current Dubai Municipality, DEWA, and material guidance.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6">
                  <p className="section-label">Sample Questions</p>
                  <div className="mt-4 space-y-2">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void submitChatText(prompt)}
                        className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 text-left text-xs leading-relaxed text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--foreground))]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Right scrollable multi-turn thread */}
              <div className="flex flex-col border border-[hsl(var(--border))] bg-[hsl(var(--surface))] lg:col-span-8">
                <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                      Active Model: {selectedModel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([messages[0]]);
                      setChatError(null);
                    }}
                    className="inline-flex min-h-[36px] items-center gap-1.5 border border-[hsl(var(--border))] px-3 text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Clear Thread</span>
                  </button>
                </div>

                <div className="h-[460px] overflow-y-auto p-6 space-y-5 bg-[hsl(var(--background))]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`border p-5 ${
                        msg.role === 'user'
                          ? 'ml-auto max-w-2xl border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                          : 'mr-auto max-w-3xl border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em]">
                        <span className="text-[hsl(var(--accent))]">
                          {msg.role === 'user' ? 'Client Enquiry' : 'CLSF Technical Advisor'}
                        </span>
                        {msg.model && (
                          <span className="text-[hsl(var(--muted-foreground))]">{msg.model}</span>
                        )}
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 border-t border-[hsl(var(--border))] pt-3">
                          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
                            Search Sources
                          </p>
                          <ul className="mt-2 space-y-1">
                            {msg.sources.map((src) => (
                              <li key={src.uri}>
                                <a
                                  href={src.uri}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs underline underline-offset-4 text-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                                >
                                  <span>{src.title}</span>
                                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="mr-auto max-w-md border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                      Preparing technical response...
                    </div>
                  )}
                  <div ref={threadEndRef} />
                </div>

                {chatError && (
                  <div role="alert" className="border-t border-[hsl(var(--accent))] bg-[hsl(var(--muted))] px-6 py-3 text-sm text-[hsl(var(--foreground))]">
                    {chatError}
                  </div>
                )}

                <form
                  onSubmit={handleChatSubmit}
                  className="flex flex-col gap-3 border-t border-[hsl(var(--border))] p-4 sm:flex-row sm:p-5"
                >
                  <label htmlFor="tech-chat-input" className="sr-only">
                    Technical question
                  </label>
                  <input
                    id="tech-chat-input"
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about BOQ scoping, waterproofing tests, MEP loads, or Dubai approvals..."
                    className="min-h-[48px] flex-1 border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[hsl(var(--accent))] px-7 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)] transition-colors hover:bg-[hsl(33_33%_39%)] disabled:opacity-40"
                  >
                    <span>Send</span>
                    <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="mt-8">
              <LiveVoiceConsultation />
            </div>
          )}

          {activeTab === 'search' && (
            <div className="mt-8 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 sm:p-10">
              <p className="section-label">Live Web Grounding · gemini-4-hydrogen</p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-[hsl(var(--foreground))]">
                Dubai Building Codes, Authority NOCs &amp; Material Standards Lookup
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[hsl(var(--muted-foreground))]">
                Query up-to-date UAE municipal rules, Civil Defence fire-safety updates, DEWA specifications, and technical standards using live Google Search grounding.
              </p>

              <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="grounded-search-input" className="sr-only">
                  Search query
                </label>
                <input
                  id="grounded-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Dubai Municipality requirements for residential villa swimming pool boundary setback"
                  className="min-h-[48px] flex-1 border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={searchLoading || !searchQuery.trim()}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[hsl(var(--foreground))] px-7 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))] transition-colors hover:bg-[hsl(var(--accent))] disabled:opacity-40"
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  <span>{searchLoading ? 'Searching...' : 'Search Grounded Answer'}</span>
                </button>
              </form>

              {searchError && (
                <div role="alert" className="mt-6 border border-[hsl(var(--accent))] bg-[hsl(var(--muted))] p-4 text-sm">
                  {searchError}
                </div>
              )}

              {searchResult && (
                <div className="mt-8 border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[hsl(var(--foreground))]">
                    {searchResult.text}
                  </p>
                  {searchResult.sources.length > 0 && (
                    <div className="mt-6 border-t border-[hsl(var(--border))] pt-4">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                        Verified Web Sources
                      </p>
                      <ul className="mt-3 space-y-2">
                        {searchResult.sources.map((src) => (
                          <li key={src.uri}>
                            <a
                              href={src.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs underline underline-offset-4 hover:text-[hsl(var(--accent))]"
                            >
                              <span>{src.title}</span>
                              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CTASection
        headline="Convert Your Brief Into a Formal Quotation"
        copy="Once your scope is clear, submit project details and drawings for a measured BOQ or site visit."
      />
    </>
  );
}
