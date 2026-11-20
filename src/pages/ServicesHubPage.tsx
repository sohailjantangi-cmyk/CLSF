import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/services';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { Image } from '../components/Image';
import { CTASection } from '../components/CTASection';

export function ServicesHubPage() {
  return (
    <>
      <Seo
        title="Contracting, Fit-Out, MEP & Maintenance Services | CLSF Dubai"
        description="Explore all five contracting divisions of CLSF Building Contracting in Dubai: Building Contracting, Interior Fit-Out & Renovation, MEP & HVAC, Interior Finishing, and Building Maintenance & AMC."
        path="/services"
      />

      <PageHero
        label="Capabilities Hub"
        title="Building Contracting, Fit-Out, MEP & Property Maintenance"
        intro="Five coordinated contracting divisions structured to take residential and commercial properties from shell construction or strip-out through architectural finishing and ongoing maintenance."
        breadcrumbs={[{ label: 'Services' }]}
      />

      <section className="bg-[hsl(var(--background))] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-16 px-6 lg:px-10">
          {SERVICE_CATEGORIES.map((category) => (
            <div
              key={category.slug}
              className="grid grid-cols-1 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] lg:grid-cols-12"
            >
              <div className="lg:col-span-5">
                <Image
                  src={category.image}
                  alt={category.title}
                  aspectClass="aspect-[4/3] lg:h-full"
                />
              </div>
              <div className="flex flex-col justify-between p-8 lg:col-span-7 lg:p-10">
                <div>
                  <p className="tabular-nums section-label">{category.number}</p>
                  <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[hsl(var(--foreground))] sm:text-3xl">
                    <Link to={`/${category.slug}`} className="transition-colors hover:text-[hsl(var(--accent))]">
                      {category.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
                    {category.description}
                  </p>

                  <div className="mt-8 border-t border-[hsl(var(--border))] pt-6">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                      Included Services
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {category.children.map((child) => (
                        <Link
                          key={child.slug}
                          to={`/${category.slug}/${child.slug}`}
                          className="group flex items-center justify-between border-b border-[hsl(var(--border))] py-2 text-sm text-[hsl(var(--foreground))] transition-colors hover:text-[hsl(var(--accent))]"
                        >
                          <span>{child.title}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/${category.slug}`}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-[hsl(var(--foreground))] px-6 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))] transition-colors hover:bg-[hsl(var(--accent))]"
                  >
                    <span>Explore {category.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/request-a-quote"
                    className="inline-flex min-h-[44px] items-center justify-center border border-[hsl(var(--border))] px-6 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--foreground))]"
                  >
                    Request Quotation
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        headline="Need a Combined Multi-Discipline Scope?"
        copy="Submit one enquiry covering civil works, MEP, interior finishing, or annual maintenance across your property."
      />
    </>
  );
}
