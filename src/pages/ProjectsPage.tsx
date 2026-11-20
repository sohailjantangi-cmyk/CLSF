import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fetchProjects } from '../lib/api';
import type { Project, ProjectCategory } from '../types';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { ProjectCard } from '../components/ProjectCard';
import { CTASection } from '../components/CTASection';

const CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Villas',
  'Renovation',
  'Interior Fit-Out',
  'MEP',
  'Swimming Pools',
  'Maintenance',
  'Commercial',
  'Other',
];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'All' | ProjectCategory>('All');

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProjects()
      .then((data) => {
        if (active) {
          setProjects(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load projects.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (a.order || 999) - (b.order || 999);
    });
    if (activeCategory === 'All') return sorted;
    return sorted.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <>
      <Seo
        title="Delivered Dubai Contracting Projects | CLSF Building Contracting"
        description="Representative residential villa builds, structural extensions, office and showroom fit-outs, MEP upgrades, pool refurbishments, and AMC contracts across Dubai."
        path="/projects"
      />

      <PageHero
        label="Portfolio"
        title="Delivered Works Across Dubai"
        intro="Representative residential, commercial fit-out, MEP engineering, and maintenance commissions executed across Dubai communities and commercial districts."
        breadcrumbs={[{ label: 'Projects' }]}
      />

      <section className="bg-[hsl(var(--background))] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Interactive category filter controls */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-2 border-b border-[hsl(var(--border))] pb-8"
          >
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-[44px] border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] transition-colors whitespace-nowrap ${
                    active
                      ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground))]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="h-[420px] border border-[hsl(var(--border))] bg-[hsl(var(--muted))]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mt-12 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-10 text-center">
              <p className="text-base text-[hsl(var(--foreground))]">{error}</p>
              <Link
                to="/request-a-quote"
                className="mt-6 inline-flex min-h-[44px] items-center justify-center bg-[hsl(var(--foreground))] px-6 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))]"
              >
                Request a Quotation
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-12 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-12 text-center">
              <p className="section-label">Custom Scope</p>
              <h2 className="mt-3 text-2xl font-medium text-[hsl(var(--foreground))]">
                Planning a {activeCategory} Project in Dubai
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                Share your drawings, property location, or technical requirements to arrange a site survey and receive a measured quotation for this category.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/request-a-quote"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[hsl(var(--accent))] px-7 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)]"
                >
                  <span>Request a Quotation</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="inline-flex min-h-[48px] items-center justify-center border border-[hsl(var(--border))] px-7 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))]"
                >
                  Show All Categories
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        headline="Discuss a Similar Scope for Your Property"
        copy="Send your project brief or schedule an on-site engineering survey in Dubai."
      />
    </>
  );
}
