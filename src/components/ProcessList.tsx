import { PROCESS_STAGES } from '../data/business';

interface ProcessListProps {
  compact?: boolean;
}

export function ProcessList({ compact = false }: ProcessListProps) {
  return (
    <div className="grid grid-cols-1 border-t border-l border-[hsl(var(--border))] md:grid-cols-2 lg:grid-cols-3">
      {PROCESS_STAGES.map((stage) => (
        <div
          key={stage.number}
          className={`border-r border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] ${
            compact ? 'p-6 lg:p-8' : 'p-8 lg:p-10'
          }`}
        >
          <p className="tabular-nums text-xs font-medium uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
            {stage.number}
          </p>
          <h3 className="mt-3 text-lg font-medium tracking-[-0.01em] text-[hsl(var(--foreground))]">
            {stage.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            {stage.summary}
          </p>
        </div>
      ))}
    </div>
  );
}
