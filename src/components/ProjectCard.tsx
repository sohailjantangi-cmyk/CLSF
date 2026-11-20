import { Image } from './Image';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex flex-col border border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
      <Image
        src={project.after_image || project.before_image}
        alt={`${project.name} — ${project.location}`}
        aspectClass="aspect-[4/3]"
      />
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em]">
          <span className="font-medium text-[hsl(var(--accent))]">{project.category}</span>
          <span aria-hidden="true" className="text-[hsl(var(--muted-foreground))]">·</span>
          <span className="text-[hsl(var(--muted-foreground))]">{project.location}</span>
        </div>
        <h3 className="mt-3 text-xl font-medium leading-snug tracking-[-0.01em] text-[hsl(var(--foreground))]">
          {project.name}
        </h3>
        <p className="mt-2 border-b border-[hsl(var(--border))] pb-4 text-xs font-medium tracking-wide text-[hsl(var(--steel))]">
          {project.scope}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          {project.short_description}
        </p>
      </div>
    </article>
  );
}
