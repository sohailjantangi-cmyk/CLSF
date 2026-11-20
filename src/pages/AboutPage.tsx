import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { BUSINESS_INFO, PROPERTY_TYPES, QUALITY_PILLARS } from '../data/business';
import { SERVICE_CATEGORIES } from '../data/services';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { Image } from '../components/Image';
import { CTASection } from '../components/CTASection';

export function AboutPage() {
  return (
    <>
      <Seo
        title="About CLSF Building Contracting | Dubai Contracting & Maintenance"
        description="Learn how CLSF Building Contracting structures villa construction, interior fit-out, MEP engineering, and property maintenance across Dubai and the UAE."
        path="/about-us"
      />

      <PageHero
        label="About CLSF"
        title="Disciplined Contracting Across Residential and Commercial Estates"
        intro="CLSF Building Contracting operates out of Port Saeed, Deira, delivering civil construction, interior fit-out, MEP installations, finishing, and planned building maintenance across Dubai and the wider UAE."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:items-stretch lg:px-10">
          <div className="lg:col-span-6">
            <SectionHeading
              label="Operating Model"
              title="Built Around Method, Coordination, and Measurable Scope"
            />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
              <p>
                Construction and refurbishment projects routinely lose time and budget at the interfaces between trades: civil crews closing walls before MEP testing, joinery workshops fabricating before plastering is plumb, or fit-outs mobilising without authority NOCs in hand.
              </p>
              <p>
                CLSF eliminates those gaps by managing civil works, MEP systems, interior finishing, and post-handover maintenance under one operational structure. Every commission begins with a physical site assessment and a line-by-line Bill of Quantities so specifications, allowances, and milestones are clear before work starts.
              </p>
              <p>
                Whether constructing a private G+1 villa, adapting a commercial floorplate in Business Bay, or running an Annual Maintenance Contract for a multi-unit residential building, our site teams work to documented hold-point checks and clean handover dossiers.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Image
              src="/src/assets/images/hero_villa_construction_1795167605296.jpg"
              alt="Completed contemporary Dubai residence built with board-formed concrete and travertine"
              aspectClass="aspect-[4/3] lg:h-full"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            label="Site Standards"
            title="Four Controls Applied to Every Contract"
          />
          <div className="mt-12 grid grid-cols-1 border-t border-l border-[hsl(var(--border))] md:grid-cols-2">
            {QUALITY_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="border-r border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] p-8 lg:p-10"
              >
                <p className="tabular-nums text-xs font-medium uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                  {pillar.number}
                </p>
                <h3 className="mt-3 text-xl font-medium text-[hsl(var(--foreground))]">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-7">
            <SectionHeading
              label="Divisions & Sectors"
              title="Residential & Commercial Coverage"
              description="Our technical teams serve private homeowners, institutional landlords, retail operators, and corporate tenants across Dubai and the wider UAE."
            />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SERVICE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/${cat.slug}`}
                  className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5 transition-colors hover:border-[hsl(var(--foreground))]"
                >
                  <span className="tabular-nums text-xs uppercase tracking-[0.22em] text-[hsl(var(--accent))]">
                    {cat.number}
                  </span>
                  <p className="mt-2 text-base font-medium text-[hsl(var(--foreground))]">{cat.title}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 border-t border-[hsl(var(--border))] pt-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                Properties Covered
              </p>
              <p className="mt-2 text-sm text-[hsl(var(--foreground))]">
                {PROPERTY_TYPES.map((p) => p.label).join(' · ')}
              </p>
            </div>
          </div>

          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 lg:col-span-5 lg:p-10">
            <p className="section-label">Dubai Head Office</p>
            <h3 className="mt-3 text-2xl font-medium text-[hsl(var(--foreground))]">
              {BUSINESS_INFO.name}
            </h3>
            <dl className="mt-8 space-y-6 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Address</dt>
                  <dd className="mt-1 text-[hsl(var(--foreground))]">{BUSINESS_INFO.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Telephone</dt>
                  <dd className="mt-1">
                    <a href={BUSINESS_INFO.phoneHref} className="tabular-nums text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]">
                      {BUSINESS_INFO.phone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Email</dt>
                  <dd className="mt-1">
                    <a href={BUSINESS_INFO.emailHref} className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]">
                      {BUSINESS_INFO.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <CTASection
        headline="Arrange a Technical Consultation"
        copy="Send your project brief or schedule an on-site engineering assessment anywhere in Dubai and the UAE."
      />
    </>
  );
}
