import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

interface PageHeroProps {
  label: string;
  title: string;
  intro: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageHero({ label, title, intro, breadcrumbs }: PageHeroProps) {
  return (
    <section className="border-b border-[hsl(0_0%_22%)] bg-[hsl(0_0%_12%)] py-16 text-[hsl(40_6%_94%)] md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={breadcrumbs} dark />
        <p className="section-label mb-4">{label}</p>
        <h1 className="max-w-4xl text-3xl font-medium leading-[1.08] tracking-[-0.02em] text-[hsl(40_6%_96%)] sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[hsl(0_0%_74%)] md:text-lg">
          {intro}
        </p>
      </div>
    </section>
  );
}
