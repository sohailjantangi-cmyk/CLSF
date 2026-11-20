import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  BUSINESS_INFO,
  HERO_SLIDES,
  PROPERTY_TYPES,
  QUALITY_PILLARS,
} from '../data/business';
import { SERVICE_CATEGORIES } from '../data/services';
import { INITIAL_PROJECTS } from '../data/projects';
import { fetchProjects } from '../lib/api';
import type { Project } from '../types';
import { Seo } from '../components/Seo';
import { Image } from '../components/Image';
import { SectionHeading } from '../components/SectionHeading';
import { ProcessList } from '../components/ProcessList';
import { ProjectCard } from '../components/ProjectCard';
import { CTASection } from '../components/CTASection';
import { Reveal } from '../components/Reveal';

export function HomePage() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    fetchProjects()
      .then((data) => {
        if (active && data.length > 0) setProjects(data);
      })
      .catch(() => {
        // Fallback to initial seeded projects if API temporarily unavailable
      })
      .finally(() => {
        if (active) setLoadingProjects(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const displayedProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.domain,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    description: `${BUSINESS_INFO.positioning} Serving ${BUSINESS_INFO.serviceArea}.`,
    areaServed: ['Dubai', 'United Arab Emirates'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Office 55, Tanvi Business Center, Al Maktoum Road, Port Saeed, Deira',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
  };

  return (
    <>
      <Seo
        title="CLSF Building Contracting | Build · Renovate · Fit-Out · Maintain — Dubai"
        description="CLSF Building Contracting delivers residential and commercial construction, interior fit-out, MEP, finishing, and building maintenance across Dubai and the UAE."
        path="/"
        jsonLd={jsonLd}
      />

      {/* 1. Full-bleed rotating hero */}
      <section className="relative min-h-[580px] lg:min-h-[680px] border-b border-[hsl(0_0%_22%)] bg-[hsl(0_0%_10%)] text-[hsl(40_6%_96%)] flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === slideIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={idx !== slideIdx}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full"
                priority={idx === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-[#141414]/68" aria-hidden="true" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <p className="section-label mb-4">Dubai &amp; UAE Contracting</p>
          <h1 className="max-w-4xl text-4xl font-medium leading-[1.06] tracking-[-0.02em] text-[hsl(40_6%_98%)] sm:text-5xl lg:text-6xl">
            Single-Point Building Contracting, Fit-Out &amp; Property Maintenance
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[hsl(40_6%_88%)] sm:text-lg">
            {BUSINESS_INFO.positioning}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/request-a-quote"
              className="inline-flex min-h-[48px] items-center justify-center gap-3 bg-[hsl(var(--accent))] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)] transition-colors hover:bg-[hsl(33_33%_39%)] whitespace-nowrap"
            >
              <span>Request a Quotation</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/site-visit"
              className="inline-flex min-h-[48px] items-center justify-center border border-[hsl(40_6%_82%)] bg-[hsl(0_0%_12%)]/60 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_96%)] transition-colors hover:bg-[hsl(40_6%_96%)] hover:text-[hsl(0_0%_12%)] whitespace-nowrap"
            >
              Book a Site Visit
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[hsl(0_0%_36%)]/60 pt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[hsl(0_0%_80%)]">
              {HERO_SLIDES[slideIdx].caption}
            </p>
            <div className="flex items-center gap-2" role="tablist" aria-label="Hero showcase slides">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.caption}
                  type="button"
                  role="tab"
                  aria-selected={idx === slideIdx}
                  aria-label={`Show slide ${idx + 1}: ${slide.caption}`}
                  onClick={() => setSlideIdx(idx)}
                  className={`h-2.5 transition-all ${
                    idx === slideIdx
                      ? 'w-10 bg-[hsl(var(--accent))]'
                      : 'w-5 bg-[hsl(0_0%_45%)] hover:bg-[hsl(40_6%_90%)]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Capability strip: 5 service categories */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              label="Capabilities"
              title="Five Integrated Contracting Divisions"
              description="Direct site supervision across civil works, interior fit-out, MEP engineering, architectural finishing, and planned maintenance."
            />
            <Link
              to="/services"
              className="inline-flex min-h-[44px] items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] underline underline-offset-4 transition-colors hover:text-[hsl(var(--accent))] whitespace-nowrap shrink-0"
            >
              <span>Explore All Services</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 border-t border-l border-[hsl(var(--border))] md:grid-cols-2 lg:grid-cols-5">
            {SERVICE_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                to={`/${category.slug}`}
                className="group flex flex-col justify-between border-r border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]"
              >
                <div>
                  <span className="tabular-nums text-xs font-medium uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                    {category.number}
                  </span>
                  <h3 className="mt-4 text-lg font-medium tracking-[-0.01em]">{category.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(0_0%_74%)]">
                    {category.tagline}
                  </p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                  <span>View Division</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How We Work summary */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                label="Methodology"
                title="Six-Stage Delivery Sequence"
                description="Every residential and commercial commission follows a documented workflow from initial site survey through final snagging clearance."
              />
              <Link
                to="/how-we-work"
                className="inline-flex min-h-[44px] items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] underline underline-offset-4 transition-colors hover:text-[hsl(var(--accent))] whitespace-nowrap shrink-0"
              >
                <span>Detailed Process</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-12">
              <ProcessList compact />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Why CLSF (Dark contrast band) */}
      <section className="border-b border-[hsl(0_0%_22%)] bg-[hsl(0_0%_12%)] py-20 text-[hsl(40_6%_94%)] lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              label="Why CLSF"
              title="Control Over Scope, Programme, and Site Quality"
              description="Built to prevent the sequencing errors, hidden variations, and unfinished snags common across fragmented sub-contracting."
              dark
            />

            <div className="mt-12 grid grid-cols-1 border-t border-l border-[hsl(0_0%_24%)] md:grid-cols-2 lg:grid-cols-4">
              {QUALITY_PILLARS.map((pillar) => (
                <div
                  key={pillar.number}
                  className="border-r border-b border-[hsl(0_0%_24%)] bg-[hsl(0_0%_14%)] p-8"
                >
                  <p className="tabular-nums text-xs font-medium uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                    {pillar.number}
                  </p>
                  <h3 className="mt-4 text-lg font-medium text-[hsl(40_6%_96%)]">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[hsl(0_0%_72%)]">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Featured Projects */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                label="Selected Works"
                title="Featured Dubai Projects"
                description="Representative residential, commercial fit-out, and MEP engineering scopes delivered across Dubai."
              />
              <Link
                to="/projects"
                className="inline-flex min-h-[44px] items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] underline underline-offset-4 transition-colors hover:text-[hsl(var(--accent))] whitespace-nowrap shrink-0"
              >
                <span>View All Projects</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {loadingProjects && displayedProjects.length === 0 ? (
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-96 border border-[hsl(var(--border))] bg-[hsl(var(--muted))]"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                {displayedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* 6. Property Types Served */}
      <section className="bg-[hsl(var(--surface))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              label="Sectors"
              title="Property Types Served"
              description="Tailored site logistics, authority permitting, and technical execution for private homeowners, landlords, and commercial tenants."
            />

            <div className="mt-12 grid grid-cols-1 border-t border-l border-[hsl(var(--border))] sm:grid-cols-2 lg:grid-cols-4">
              {PROPERTY_TYPES.map((type, idx) => (
                <div
                  key={type.label}
                  className="border-r border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 lg:p-7"
                >
                  <p className="tabular-nums text-xs uppercase tracking-[0.22em] text-[hsl(var(--accent))]">
                    0{idx + 1}
                  </p>
                  <h3 className="mt-3 text-lg font-medium text-[hsl(var(--foreground))]">
                    {type.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {type.description}
                  </p>
                </div>
              ))}
              <Link
                to="/request-a-quote"
                className="flex flex-col justify-between border-r border-b border-[hsl(var(--border))] bg-[hsl(var(--foreground))] p-6 text-[hsl(var(--background))] transition-colors hover:bg-[hsl(var(--accent))] lg:p-7"
              >
                <span className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--accent))] group-hover:text-white">
                  Enquire
                </span>
                <div>
                  <p className="text-lg font-medium">Discuss Your Property</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
                    <span>Request a Quotation</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. CTA Band */}
      <CTASection
        headline="Prepare a Measured Scope & Quotation"
        copy="Share your property details, drawings, or maintenance requirements for a structured BOQ or site inspection."
      />
    </>
  );
}
