import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { SERVICE_CATEGORIES } from '../data/services';

export function Header() {
  const { pathname } = useLocation();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isServicesActive =
    pathname === '/services' ||
    SERVICE_CATEGORIES.some((cat) => pathname.startsWith(`/${cat.slug}`));

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-[hsl(0_0%_22%)] bg-[hsl(0_0%_12%)] text-[hsl(40_6%_94%)]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
        <Link
          to="/"
          className="flex shrink-0 flex-col justify-center whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--accent))]"
        >
          <span className="text-xl font-bold leading-none tracking-[0.06em] text-[hsl(40_6%_96%)]">
            {BUSINESS_INFO.shortName}
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase leading-none tracking-[0.25em] text-[hsl(var(--accent))]">
            {BUSINESS_INFO.tagline}
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-5 xl:gap-7 lg:flex">
          <Link
            to="/"
            className={`whitespace-nowrap shrink-0 text-sm transition-colors hover:text-[hsl(var(--accent))] ${
              pathname === '/' ? 'text-[hsl(var(--accent))]' : 'text-[hsl(40_6%_90%)]'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about-us"
            className={`whitespace-nowrap shrink-0 text-sm transition-colors hover:text-[hsl(var(--accent))] ${
              pathname === '/about-us' ? 'text-[hsl(var(--accent))]' : 'text-[hsl(40_6%_90%)]'
            }`}
          >
            About
          </Link>

          <div
            ref={megaRef}
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((prev) => !prev)}
              className={`flex min-h-[44px] items-center gap-1.5 whitespace-nowrap shrink-0 text-sm transition-colors hover:text-[hsl(var(--accent))] ${
                isServicesActive ? 'text-[hsl(var(--accent))]' : 'text-[hsl(40_6%_90%)]'
              }`}
            >
              <span>Services</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {megaOpen && (
              <div className="fixed inset-x-0 top-20 z-50 border-b border-[hsl(0_0%_24%)] bg-[hsl(0_0%_10%)] text-[hsl(40_6%_94%)]">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                  <div className="grid grid-cols-5 gap-6">
                    {SERVICE_CATEGORIES.map((category) => (
                      <div key={category.slug} className="border-r border-[hsl(0_0%_20%)] pr-5 last:border-r-0 last:pr-0">
                        <Link
                          to={`/${category.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="block border-b border-[hsl(0_0%_22%)] pb-3 transition-colors hover:text-[hsl(var(--accent))]"
                        >
                          <span className="block tabular-nums text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                            {category.number}
                          </span>
                          <span className="mt-1 block text-sm font-medium text-[hsl(40_6%_96%)]">
                            {category.title}
                          </span>
                        </Link>
                        <ul className="mt-3 space-y-2">
                          {category.children.map((child) => (
                            <li key={child.slug}>
                              <Link
                                to={`/${category.slug}/${child.slug}`}
                                onClick={() => setMegaOpen(false)}
                                className="block text-xs leading-snug text-[hsl(0_0%_72%)] transition-colors hover:text-[hsl(var(--accent))]"
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[hsl(0_0%_20%)] pt-5">
                    <p className="text-xs text-[hsl(0_0%_64%)]">{BUSINESS_INFO.positioning}</p>
                    <Link
                      to="/services"
                      onClick={() => setMegaOpen(false)}
                      className="text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--accent))] transition-colors hover:text-[hsl(40_6%_96%)]"
                    >
                      View all capabilities
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/projects"
            className={`whitespace-nowrap shrink-0 text-sm transition-colors hover:text-[hsl(var(--accent))] ${
              pathname === '/projects' ? 'text-[hsl(var(--accent))]' : 'text-[hsl(40_6%_90%)]'
            }`}
          >
            Projects
          </Link>
          <Link
            to="/technical-desk"
            className={`whitespace-nowrap shrink-0 text-sm transition-colors hover:text-[hsl(var(--accent))] ${
              pathname === '/technical-desk' ? 'text-[hsl(var(--accent))]' : 'text-[hsl(40_6%_90%)]'
            }`}
          >
            AI Chatbot
          </Link>
          <Link
            to="/contact-us"
            className={`whitespace-nowrap shrink-0 text-sm transition-colors hover:text-[hsl(var(--accent))] ${
              pathname === '/contact-us' ? 'text-[hsl(var(--accent))]' : 'text-[hsl(40_6%_90%)]'
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-6 lg:flex shrink-0">
          <a
            href={BUSINESS_INFO.phoneHref}
            className="tabular-nums flex items-center gap-2 whitespace-nowrap text-xs font-medium tracking-[0.08em] text-[hsl(40_6%_90%)] transition-colors hover:text-[hsl(var(--accent))]"
          >
            <Phone className="h-3.5 w-3.5 text-[hsl(var(--accent))]" aria-hidden="true" />
            <span>{BUSINESS_INFO.phone}</span>
          </a>
          <Link
            to="/request-a-quote"
            className="inline-flex min-h-[44px] items-center justify-center bg-[hsl(var(--accent))] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-[hsl(40_6%_98%)] transition-colors hover:bg-[hsl(33_33%_39%)] whitespace-nowrap shrink-0"
          >
            Request a Quotation
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center border border-[hsl(0_0%_26%)] text-[hsl(40_6%_94%)] lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 top-20 z-50 overflow-y-auto bg-[hsl(0_0%_10%)] px-6 py-8 text-[hsl(40_6%_94%)] lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col border-t border-[hsl(0_0%_22%)]">
            <Link
              to="/"
              className="flex min-h-[48px] items-center border-b border-[hsl(0_0%_22%)] text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="flex min-h-[48px] items-center border-b border-[hsl(0_0%_22%)] text-base font-medium"
            >
              About
            </Link>

            <div className="border-b border-[hsl(0_0%_22%)] py-2">
              <div className="flex items-center justify-between">
                <Link to="/services" className="flex min-h-[44px] items-center text-base font-medium">
                  Services
                </Link>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
                  5 Divisions
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {SERVICE_CATEGORIES.map((category) => {
                  const isExp = expandedCat === category.slug;
                  return (
                    <div key={category.slug} className="border-t border-[hsl(0_0%_18%)]">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/${category.slug}`}
                          className="flex min-h-[44px] flex-1 items-center text-sm text-[hsl(40_6%_88%)]"
                        >
                          {category.title}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={isExp}
                          aria-label={`Toggle ${category.title} services`}
                          onClick={() => setExpandedCat(isExp ? null : category.slug)}
                          className="flex h-11 w-11 items-center justify-center text-[hsl(var(--accent))]"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isExp ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                      {isExp && (
                        <ul className="space-y-1 pb-3 pl-4">
                          {category.children.map((child) => (
                            <li key={child.slug}>
                              <Link
                                to={`/${category.slug}/${child.slug}`}
                                className="flex min-h-[40px] items-center text-xs text-[hsl(0_0%_72%)] hover:text-[hsl(var(--accent))]"
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              to="/projects"
              className="flex min-h-[48px] items-center border-b border-[hsl(0_0%_22%)] text-base font-medium"
            >
              Projects
            </Link>
            <Link
              to="/technical-desk"
              className="flex min-h-[48px] items-center border-b border-[hsl(0_0%_22%)] text-base font-medium"
            >
              AI Chatbot &amp; Technical Desk
            </Link>
            <Link
              to="/how-we-work"
              className="flex min-h-[48px] items-center border-b border-[hsl(0_0%_22%)] text-base font-medium"
            >
              How We Work
            </Link>
            <Link
              to="/contact-us"
              className="flex min-h-[48px] items-center border-b border-[hsl(0_0%_22%)] text-base font-medium"
            >
              Contact
            </Link>
          </nav>

          <div className="mt-8 space-y-3">
            <a
              href={BUSINESS_INFO.phoneHref}
              className="tabular-nums flex min-h-[48px] items-center justify-center gap-2 border border-[hsl(0_0%_30%)] text-sm font-medium text-[hsl(40_6%_94%)]"
            >
              <Phone className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>
            <Link
              to="/request-a-quote"
              className="flex min-h-[48px] items-center justify-center bg-[hsl(var(--accent))] px-6 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)]"
            >
              Request a Quotation
            </Link>
            <Link
              to="/site-visit"
              className="flex min-h-[48px] items-center justify-center border border-[hsl(0_0%_30%)] px-6 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_94%)]"
            >
              Book a Site Visit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
