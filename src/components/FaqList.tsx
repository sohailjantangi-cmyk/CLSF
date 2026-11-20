import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { FaqItem } from '../types';

interface FaqListProps {
  items: FaqItem[];
}

export function FaqList({ items }: FaqListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t border-[hsl(var(--border))]">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.question} className="border-b border-[hsl(var(--border))]">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex min-h-[56px] w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[hsl(var(--accent))]"
            >
              <span className="text-base font-medium text-[hsl(var(--foreground))] sm:text-lg">
                {item.question}
              </span>
              {isOpen ? (
                <Minus className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
              )}
            </button>
            {isOpen && (
              <div className="pb-6 pr-8 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
