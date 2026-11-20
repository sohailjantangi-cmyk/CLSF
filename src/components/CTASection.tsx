import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  label?: string;
  headline: string;
  copy: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export function CTASection({
  label = 'Next Step',
  headline,
  copy,
  primaryLabel = 'Request a Quotation',
  primaryTo = '/request-a-quote',
  secondaryLabel = 'Book a Site Visit',
  secondaryTo = '/site-visit',
}: CTASectionProps) {
  return (
    <section className="border-t border-[hsl(0_0%_22%)] bg-[hsl(0_0%_12%)] py-20 text-[hsl(40_6%_94%)] md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-6 lg:flex-row lg:items-end lg:px-10">
        <div className="max-w-2xl">
          <p className="section-label mb-3">{label}</p>
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-[hsl(40_6%_96%)] sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[hsl(0_0%_74%)]">{copy}</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            to={primaryTo}
            className="inline-flex min-h-[48px] items-center justify-center gap-3 bg-[hsl(var(--accent))] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)] transition-colors hover:bg-[hsl(33_33%_39%)] whitespace-nowrap shrink-0"
          >
            <span>{primaryLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to={secondaryTo}
            className="inline-flex min-h-[48px] items-center justify-center border border-[hsl(0_0%_36%)] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_94%)] transition-colors hover:border-[hsl(40_6%_94%)] hover:bg-[hsl(0_0%_18%)] whitespace-nowrap shrink-0"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
