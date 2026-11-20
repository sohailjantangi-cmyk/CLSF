import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { findCategoryBySlug } from '../data/services';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { Image } from '../components/Image';
import { ProcessList } from '../components/ProcessList';
import { FaqList } from '../components/FaqList';
import { CTASection } from '../components/CTASection';
import { NotFoundPage } from './NotFoundPage';

interface ServiceCategoryPageProps {
  categorySlug: string;
}

export function ServiceCategoryPage({ categorySlug }: ServiceCategoryPageProps) {
  const category = findCategoryBySlug(categorySlug);

  if (!category) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Seo
        title={`${category.title} Dubai | CLSF Building Contracting`}
        description={category.description}
        path={`/${category.slug}`}
      />

      <PageHero
        label={`Division ${category.number}`}
        title={category.title}
        intro={category.description}
        breadcrumbs={[{ label: 'Services', to: '/services' }, { label: category.title }]}
      />

      {/* 4 Quality control points */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            label="Quality Control"
            title={`How We Control ${category.title}`}
          />
          <div className="mt-10 grid grid-cols-1 border-t border-l border-[hsl(var(--border))] md:grid-cols-2 lg:grid-cols-4">
            {category.qualityPoints.map((point, idx) => (
              <div
                key={point.title}
                className="border-r border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 lg:p-7"
              >
                <p className="tabular-nums text-xs uppercase tracking-[0.22em] text-[hsl(var(--accent))]">
                  0{idx + 1}
                </p>
                <h3 className="mt-3 text-base font-medium text-[hsl(var(--foreground))]">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {point.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of child services */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            label="Specialist Scopes"
            title={`${category.title} Services`}
            description="Select a service below for detailed technical coverage, testing standards, and deliverables."
          />

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {category.children.map((child, idx) => (
              <Link
                key={child.slug}
                to={`/${category.slug}/${child.slug}`}
                className="group flex flex-col border border-[hsl(var(--border))] bg-[hsl(var(--surface))] transition-colors hover:border-[hsl(var(--foreground))]"
              >
                <Image
                  src={child.image}
                  alt={child.title}
                  aspectClass="aspect-[4/3]"
                />
                <div className="flex flex-1 flex-col justify-between p-6 lg:p-7">
                  <div>
                    <p className="tabular-nums text-xs uppercase tracking-[0.22em] text-[hsl(var(--accent))]">
                      {category.number}.{idx + 1}
                    </p>
                    <h3 className="mt-2 text-xl font-medium tracking-[-0.01em] text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--accent))]">
                      {child.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                      {child.summary}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--accent))]">
                    <span>Technical Scope</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            label="Delivery Workflow"
            title="From Survey to Documented Handover"
          />
          <div className="mt-10">
            <ProcessList compact />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <SectionHeading
            label="Technical Questions"
            title={`${category.title} FAQs`}
          />
          <div className="mt-10">
            <FaqList items={category.faqs} />
          </div>
        </div>
      </section>

      <CTASection
        headline={`Request a ${category.title} Quotation`}
        copy="Share drawings, site location, and scope notes for an itemised BOQ or technical site inspection."
      />
    </>
  );
}
