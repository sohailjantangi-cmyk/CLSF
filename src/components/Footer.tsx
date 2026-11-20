import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { SERVICE_CATEGORIES } from '../data/services';

export function Footer() {
  return (
    <footer className="border-t border-[hsl(0_0%_22%)] bg-[hsl(0_0%_10%)] text-[hsl(40_6%_90%)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div>
              <span className="block text-xl font-bold leading-none tracking-[0.06em] text-[hsl(40_6%_96%)]">
                {BUSINESS_INFO.shortName}
              </span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                {BUSINESS_INFO.tagline}
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[hsl(0_0%_68%)]">
              {BUSINESS_INFO.positioning} Serving {BUSINESS_INFO.serviceArea}.
            </p>
          </div>

          <div>
            <p className="section-label mb-4">Services</p>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/${category.slug}`}
                    className="text-[hsl(0_0%_74%)] transition-colors hover:text-[hsl(var(--accent))]"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services"
                  className="text-[hsl(var(--accent))] transition-colors hover:text-[hsl(40_6%_96%)]"
                >
                  All Capabilities
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="section-label mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about-us" className="text-[hsl(0_0%_74%)] transition-colors hover:text-[hsl(var(--accent))]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-we-work" className="text-[hsl(0_0%_74%)] transition-colors hover:text-[hsl(var(--accent))]">
                  How We Work
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-[hsl(0_0%_74%)] transition-colors hover:text-[hsl(var(--accent))]">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/technical-desk" className="text-[hsl(0_0%_74%)] transition-colors hover:text-[hsl(var(--accent))]">
                  AI Chatbot &amp; Technical Desk
                </Link>
              </li>
              <li>
                <Link to="/request-a-quote" className="text-[hsl(0_0%_74%)] transition-colors hover:text-[hsl(var(--accent))]">
                  Request a Quotation
                </Link>
              </li>
              <li>
                <Link to="/site-visit" className="text-[hsl(0_0%_74%)] transition-colors hover:text-[hsl(var(--accent))]">
                  Book a Site Visit
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-[hsl(0_0%_74%)] transition-colors hover:text-[hsl(var(--accent))]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="section-label mb-4">Contact</p>
            <ul className="space-y-4 text-sm text-[hsl(0_0%_74%)]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                <span>{BUSINESS_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="tabular-nums transition-colors hover:text-[hsl(var(--accent))]"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="transition-colors hover:text-[hsl(var(--accent))]"
                >
                  {BUSINESS_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-[hsl(0_0%_20%)] pt-8 text-xs text-[hsl(0_0%_60%)] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy-policy" className="transition-colors hover:text-[hsl(var(--accent))]">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="transition-colors hover:text-[hsl(var(--accent))]">
              Terms &amp; Conditions
            </Link>
            <Link to="/cookie-policy" className="transition-colors hover:text-[hsl(var(--accent))]">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
