import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PROCESS_STAGES, QUALITY_PILLARS } from '../data/business';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { CTASection } from '../components/CTASection';

const HOLD_POINTS = [
  {
    stage: 'Before Pouring Concrete or Closing Walls',
    checks: 'Rebar cover and spacing check, embedded MEP sleeve verification, and structural prop sign-off.',
  },
  {
    stage: 'Wet Areas & Roof Waterproofing',
    checks: 'Two-coat membrane film thickness check followed by a documented 48-hour ponding flood test.',
  },
  {
    stage: 'Concealed MEP Pipework & Ducts',
    checks: '10-bar hydrostatic supply pressure holding test, gravity drain flow test, and insulated plenum smoke/light checks.',
  },
  {
    stage: 'Pre-Handover Commissioning',
    checks: 'Anemometer airflow balancing, electrical megger and RCD trip verification, and line-by-line snagging closure.',
  },
];

export function HowWeWorkPage() {
  return (
    <>
      <Seo
        title="How We Work | Six-Stage Delivery Method — CLSF Building Contracting"
        description="Explore CLSF Building Contracting's structured six-stage contracting workflow: consultation, site assessment, measured BOQ, approvals, execution, and staged inspection."
        path="/how-we-work"
      />

      <PageHero
        label="Methodology"
        title="Six Stages From Initial Survey to Handover"
        intro="Every construction, fit-out, MEP, and maintenance engagement follows a single documented sequence built to eliminate scope ambiguity and trade clashes."
        breadcrumbs={[{ label: 'How We Work' }]}
      />

      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            label="Workflow"
            title="The Delivery Programme"
          />

          <div className="mt-12 divide-y divide-[hsl(var(--border))] border-t border-b border-[hsl(var(--border))]">
            {PROCESS_STAGES.map((stage) => (
              <div
                key={stage.number}
                className="grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <div className="md:col-span-2">
                  <span className="tabular-nums text-sm font-medium uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                    Stage {stage.number}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="text-xl font-medium text-[hsl(var(--foreground))]">{stage.title}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {stage.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            label="Inspection Hold Points"
            title="Mandatory Testing Before Concealment"
            description="No wall, ceiling, or screed is closed until the underlying structural, waterproofing, or MEP installation passes recorded field tests."
          />

          <div className="mt-12 grid grid-cols-1 border-t border-l border-[hsl(var(--border))] md:grid-cols-2">
            {HOLD_POINTS.map((item, idx) => (
              <div
                key={item.stage}
                className="border-r border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] p-8"
              >
                <p className="tabular-nums text-xs uppercase tracking-[0.22em] text-[hsl(var(--accent))]">
                  Hold Point 0{idx + 1}
                </p>
                <h3 className="mt-3 text-lg font-medium text-[hsl(var(--foreground))]">{item.stage}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {item.checks}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            label="Contracting Governance"
            title="Commercial Clarity Before Mobilisation"
          />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {QUALITY_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-7"
              >
                <p className="tabular-nums text-xs uppercase tracking-[0.22em] text-[hsl(var(--accent))]">
                  {pillar.number}
                </p>
                <h3 className="mt-3 text-lg font-medium text-[hsl(var(--foreground))]">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/request-a-quote"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[hsl(var(--foreground))] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))] transition-colors hover:bg-[hsl(var(--accent))]"
            >
              <span>Start a Quotation Enquiry</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/site-visit"
              className="inline-flex min-h-[48px] items-center justify-center border border-[hsl(var(--border))] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--foreground))]"
            >
              Schedule a Site Survey
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        headline="Begin With a Site Assessment"
        copy="Arrange an inspection at your villa, apartment, office, or commercial property in Dubai."
      />
    </>
  );
}
