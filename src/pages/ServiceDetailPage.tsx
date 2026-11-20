import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { findChildService } from '../data/services';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { Image } from '../components/Image';
import { ProcessList } from '../components/ProcessList';
import { FaqList } from '../components/FaqList';
import { CTASection } from '../components/CTASection';
import { NotFoundPage } from './NotFoundPage';

interface ServiceDetailPageProps {
  categorySlug: string;
}

export function ServiceDetailPage({ categorySlug }: ServiceDetailPageProps) {
  const { child } = useParams<{ child: string }>();
  const match = child ? findChildService(categorySlug, child) : undefined;

  if (!match) {
    return <NotFoundPage />;
  }

  const { category, service } = match;

  return (
    <>
      <Seo
        title={`${service.title} Dubai | ${category.title} — CLSF`}
        description={service.summary}
        path={`/${category.slug}/${service.slug}`}
      />

      <PageHero
        label={category.title}
        title={service.title}
        intro={service.summary}
        breadcrumbs={[
          { label: 'Services', to: '/services' },
          { label: category.title, to: `/${category.slug}` },
          { label: service.title },
        ]}
      />

      {/* What the service covers + visual */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:items-stretch lg:px-10">
          <div className="lg:col-span-6">
            <SectionHeading
              label="Scope of Works"
              title="What the Service Covers"
            />
            <ul className="mt-8 space-y-4 border-t border-[hsl(var(--border))] pt-6">
              {service.covers.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[hsl(var(--foreground))] sm:text-base">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/request-a-quote"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[hsl(var(--foreground))] px-7 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))] transition-colors hover:bg-[hsl(var(--accent))]"
              >
                <span>Request a Quotation</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/site-visit"
                className="inline-flex min-h-[48px] items-center justify-center border border-[hsl(var(--border))] px-7 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--foreground))]"
              >
                Book a Site Visit
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Image
              src={service.image}
              alt={`${service.title} in Dubai by CLSF Building Contracting`}
              aspectClass="aspect-[4/3] lg:h-full"
            />
          </div>
        </div>
      </section>

      {/* How it is delivered & What the client receives */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-2 lg:px-10">
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-8 lg:p-10">
            <p className="section-label">Site Execution</p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[hsl(var(--foreground))]">
              How It Is Delivered
            </h2>
            <ul className="mt-6 space-y-4 border-t border-[hsl(var(--border))] pt-6">
              {service.delivery.map((item, idx) => (
                <li key={item} className="flex items-start gap-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
                  <span className="tabular-nums text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
                    0{idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-8 lg:p-10">
            <p className="section-label">Handover Standard</p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[hsl(var(--foreground))]">
              What the Client Receives
            </h2>
            <ul className="mt-6 space-y-4 border-t border-[hsl(var(--border))] pt-6">
              {service.deliverables.map((item, idx) => (
                <li key={item} className="flex items-start gap-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
                  <span className="tabular-nums text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
                    0{idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            label="Sequence"
            title="Six-Stage Contract Process"
          />
          <div className="mt-10">
            <ProcessList compact />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-[hsl(var(--surface))] py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <SectionHeading
            label="Technical Questions"
            title={`${service.title} FAQs`}
          />
          <div className="mt-10">
            <FaqList items={service.faqs} />
          </div>
        </div>
      </section>

      <CTASection
        headline={`Enquire About ${service.title}`}
        copy="Request a measured quotation or book a site survey with our engineering team."
      />
    </>
  );
}
