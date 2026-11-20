import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { CTASection } from '../components/CTASection';

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found | CLSF Building Contracting"
        description="The requested page could not be found on CLSF Building Contracting."
        path="/404"
        statusCode={404}
      />

      <PageHero
        label="Error 404"
        title="Page Not Found"
        intro="The requested URL does not match an active page on the CLSF Building Contracting website."
        breadcrumbs={[{ label: 'Not Found' }]}
      />

      <section className="bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 border-t border-[hsl(var(--border))] pt-10 md:grid-cols-3">
            <Link
              to="/"
              className="flex items-center justify-between border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 transition-colors hover:border-[hsl(var(--foreground))]"
            >
              <div>
                <p className="section-label">Home</p>
                <p className="mt-2 text-lg font-medium text-[hsl(var(--foreground))]">Return to Homepage</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
            </Link>

            <Link
              to="/services"
              className="flex items-center justify-between border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 transition-colors hover:border-[hsl(var(--foreground))]"
            >
              <div>
                <p className="section-label">Capabilities</p>
                <p className="mt-2 text-lg font-medium text-[hsl(var(--foreground))]">Browse All 5 Divisions</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
            </Link>

            <Link
              to="/request-a-quote"
              className="flex items-center justify-between border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 transition-colors hover:border-[hsl(var(--foreground))]"
            >
              <div>
                <p className="section-label">Enquiry</p>
                <p className="mt-2 text-lg font-medium text-[hsl(var(--foreground))]">Request a Quotation</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        headline="Looking for a Specific Service?"
        copy="Request a measured quotation or book a site survey anywhere in Dubai and the UAE."
      />
    </>
  );
}
