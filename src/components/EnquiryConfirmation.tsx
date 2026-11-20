import { Link } from 'react-router-dom';
import { Check, Mail } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import type { Lead } from '../types';

interface EnquiryConfirmationProps {
  lead: Lead;
}

export function EnquiryConfirmation({ lead }: EnquiryConfirmationProps) {
  const summaryLines = [
    `Reference: ${lead.lead_id}`,
    `Enquiry Type: ${lead.enquiry_type.replace('_', ' ').toUpperCase()}`,
    `Name: ${lead.name}`,
    lead.company ? `Company: ${lead.company}` : null,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.property_type ? `Property Type: ${lead.property_type}` : null,
    lead.services.length > 0 ? `Services: ${lead.services.join(', ')}` : null,
    lead.location_area || lead.location_city
      ? `Location: ${[lead.location_area, lead.location_city, lead.location_address].filter(Boolean).join(', ')}`
      : null,
    lead.project_status ? `Project Status: ${lead.project_status}` : null,
    lead.preferred_visit_date
      ? `Preferred Visit: ${lead.preferred_visit_date}${lead.preferred_visit_time ? ` (${lead.preferred_visit_time})` : ''}`
      : null,
    lead.project_size_area ? `Approximate Area: ${lead.project_size_area} sq ft` : null,
    lead.project_size_floors ? `Floors: ${lead.project_size_floors}` : null,
    lead.project_size_estimate ? `Estimated Scope: ${lead.project_size_estimate}` : null,
    lead.preferred_start_date ? `Expected Start Date: ${lead.preferred_start_date}` : null,
    lead.description ? `Requirements:\n${lead.description}` : null,
    lead.attachments.length > 0
      ? `Attachments:\n${lead.attachments.map((a) => `- ${a.originalName}: ${window.location.origin}${a.url.startsWith('/') ? a.url : `/${a.url}`}`).join('\n')}`
      : null,
  ].filter(Boolean) as string[];

  const mailtoSubject = encodeURIComponent(`Enquiry ${lead.lead_id} — ${lead.name}`);
  const mailtoBody = encodeURIComponent(summaryLines.join('\n'));
  const mailtoHref = `mailto:${BUSINESS_INFO.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const rows: { label: string; value: string }[] = [
    { label: 'Reference', value: lead.lead_id },
    { label: 'Contact', value: `${lead.name}${lead.company ? ` · ${lead.company}` : ''}` },
    { label: 'Phone / Email', value: `${lead.phone}${lead.email ? ` · ${lead.email}` : ''}` },
    { label: 'Property Type', value: lead.property_type || 'Not specified' },
    { label: 'Services', value: lead.services.length > 0 ? lead.services.join(', ') : 'Not specified' },
    {
      label: 'Location',
      value: [lead.location_area, lead.location_city, lead.location_address].filter(Boolean).join(', ') || 'Dubai',
    },
    ...(lead.project_status ? [{ label: 'Project Status', value: lead.project_status }] : []),
    ...(lead.preferred_visit_date
      ? [
          {
            label: 'Preferred Visit',
            value: `${lead.preferred_visit_date}${lead.preferred_visit_time ? ` · ${lead.preferred_visit_time}` : ''}`,
          },
        ]
      : []),
    ...(lead.project_size_area || lead.project_size_floors || lead.project_size_estimate
      ? [
          {
            label: 'Project Size',
            value: [
              lead.project_size_area ? `${lead.project_size_area} sq ft` : null,
              lead.project_size_floors ? `${lead.project_size_floors} floors` : null,
              lead.project_size_estimate || null,
            ]
              .filter(Boolean)
              .join(' · '),
          },
        ]
      : []),
    ...(lead.preferred_start_date ? [{ label: 'Expected Start', value: lead.preferred_start_date }] : []),
    ...(lead.description ? [{ label: 'Requirement Brief', value: lead.description }] : []),
  ];

  return (
    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 lg:p-12">
      <div className="flex items-start gap-4 border-b border-[hsl(var(--border))] pb-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
          <Check className="h-5 w-5 text-[hsl(var(--accent))]" aria-hidden="true" />
        </div>
        <div>
          <p className="section-label">Enquiry Logged</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-[hsl(var(--foreground))] sm:text-3xl">
            Reference <span className="tabular-nums text-[hsl(var(--accent))]">{lead.lead_id}</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            {lead.email_status === 'sent'
              ? `Your enquiry has been submitted through the CLSF portal and emailed directly to ${BUSINESS_INFO.email}. A project engineer will review the scope and contact you on ${lead.phone}.`
              : `Your enquiry has been submitted through the CLSF portal and queued for ${BUSINESS_INFO.email} inside our management desk. A project engineer will review the scope and contact you on ${lead.phone}.`}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-[hsl(var(--border))]">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
            <dt className="text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
              {row.label}
            </dt>
            <dd className="text-sm leading-relaxed text-[hsl(var(--foreground))] sm:col-span-2 whitespace-pre-line">
              {row.value}
            </dd>
          </div>
        ))}
        {lead.attachments.length > 0 && (
          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
            <dt className="text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
              Attachments
            </dt>
            <dd className="space-y-2 sm:col-span-2">
              {lead.attachments.map((file) => (
                <div key={file.filename}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline underline-offset-4 text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]"
                  >
                    {file.originalName}
                  </a>
                </div>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-8 flex flex-col gap-4 border-t border-[hsl(var(--border))] pt-8 sm:flex-row">
        <Link
          to="/"
          className="inline-flex min-h-[48px] items-center justify-center bg-[hsl(var(--foreground))] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))] transition-colors hover:bg-[hsl(var(--accent))]"
        >
          Done
        </Link>
        <a
          href={mailtoHref}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-[hsl(var(--foreground))] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          <span>Email CLSF</span>
        </a>
      </div>
    </div>
  );
}
