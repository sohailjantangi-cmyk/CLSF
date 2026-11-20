interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  dark = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className="section-label mb-3">{label}</p>
      <h2
        className={`max-w-3xl text-2xl font-medium leading-[1.12] tracking-[-0.02em] sm:text-3xl lg:text-4xl ${
          dark ? 'text-[hsl(40_6%_96%)]' : 'text-[hsl(var(--foreground))]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed ${
            dark ? 'text-[hsl(0_0%_72%)]' : 'text-[hsl(var(--muted-foreground))]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
