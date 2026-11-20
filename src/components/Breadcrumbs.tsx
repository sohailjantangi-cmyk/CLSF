import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  dark?: boolean;
}

export function Breadcrumbs({ items, dark = true }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className={`flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] ${
          dark ? 'text-[hsl(0_0%_68%)]' : 'text-[hsl(var(--muted-foreground))]'
        }`}
      >
        <li>
          <Link to="/" className="transition-colors hover:text-[hsl(var(--accent))]">
            Home
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {item.to && !isLast ? (
                <Link to={item.to} className="transition-colors hover:text-[hsl(var(--accent))]">
                  {item.label}
                </Link>
              ) : (
                <span className={dark ? 'text-[hsl(40_6%_94%)]' : 'text-[hsl(var(--foreground))]'}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
