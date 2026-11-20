import { useState, type FormEvent } from 'react';
import { Check, FileUp, Trash2 } from 'lucide-react';
import { createLead, uploadAttachments } from '../lib/api';
import type { AttachmentFile, Lead } from '../types';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { DubaiLocationPicker } from '../components/DubaiLocationPicker';
import { EnquiryConfirmation } from '../components/EnquiryConfirmation';
import { CTASection } from '../components/CTASection';

const PROPERTY_TYPES = [
  'Villa',
  'Apartment',
  'Office',
  'Retail/Showroom',
  'Gym',
  'Warehouse',
  'Commercial Property',
  'Other',
];

const VISIT_SERVICES = [
  'Villa Construction / Extension',
  'Interior Fit-Out & Renovation',
  'MEP & HVAC Assessment',
  'Waterproofing / Structural Inspection',
  'Interior Finishing',
  'Building Maintenance / AMC',
];

export function SiteVisitPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState('Villa');
  const [services, setServices] = useState<string[]>([]);
  const [locationArea, setLocationArea] = useState('');
  const [locationCity, setLocationCity] = useState('Dubai');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('Morning (09:00 – 12:00)');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  function toggleService(item: string) {
    setServices((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  }

  async function handleFileChange(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadAttachments(Array.from(files));
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'File upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !locationArea.trim() || !visitDate) {
      setError('Please complete your name, phone number, community/area, and preferred visit date.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const lead = await createLead({
        enquiry_type: 'site_visit',
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        email: email.trim(),
        property_type: propertyType,
        services: services.length > 0 ? services : ['Site Visit Inspection'],
        location_area: locationArea.trim(),
        location_city: locationCity.trim() || 'Dubai',
        preferred_visit_date: visitDate,
        preferred_visit_time: visitTime,
        description: notes.trim() || 'Requested on-site engineering assessment.',
        attachments,
      });
      setSubmittedLead(lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to schedule site visit.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Book a Site Visit | CLSF Building Contracting Dubai"
        description="Schedule an on-site engineering inspection with CLSF Building Contracting anywhere in Dubai and the UAE for construction, fit-out, MEP, or AMC assessment."
        path="/site-visit"
      />

      <PageHero
        label="Site Inspection"
        title="Book an Engineering Site Visit"
        intro="Arrange for a CLSF project engineer to inspect existing site conditions, verify MEP capacity, take laser measurements, and review authority requirements before quoting."
        breadcrumbs={[{ label: 'Book a Site Visit' }]}
      />

      <section className="bg-[hsl(var(--background))] py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          {submittedLead ? (
            <EnquiryConfirmation lead={submittedLead} />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 sm:p-10"
            >
              <p className="section-label">Visit Scheduling</p>
              <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[hsl(var(--foreground))]">
                Property &amp; Appointment Details
              </h2>

              {error && (
                <div role="alert" className="mt-6 border border-[hsl(var(--accent))] bg-[hsl(var(--muted))] p-4 text-sm text-[hsl(var(--foreground))]">
                  {error}
                </div>
              )}

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="visit-name" className="block text-xs font-medium uppercase tracking-[0.18em]">
                    Full Name *
                  </label>
                  <input
                    id="visit-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="visit-phone" className="block text-xs font-medium uppercase tracking-[0.18em]">
                    Phone Number *
                  </label>
                  <input
                    id="visit-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 5X XXX XXXX"
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="visit-company" className="block text-xs font-medium uppercase tracking-[0.18em]">
                    Company (Optional)
                  </label>
                  <input
                    id="visit-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="visit-email" className="block text-xs font-medium uppercase tracking-[0.18em]">
                    Email Address (Optional)
                  </label>
                  <input
                    id="visit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="visit-property" className="block text-xs font-medium uppercase tracking-[0.18em]">
                    Property Type *
                  </label>
                  <select
                    id="visit-property"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  >
                    {PROPERTY_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="visit-area" className="block text-xs font-medium uppercase tracking-[0.18em]">
                    Community / Area *
                  </label>
                  <input
                    id="visit-area"
                    type="text"
                    required
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                    placeholder="e.g. Jumeirah, Business Bay, Al Quoz"
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="visit-city" className="block text-xs font-medium uppercase tracking-[0.18em]">
                    City / Emirate
                  </label>
                  <input
                    id="visit-city"
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="visit-date" className="block text-xs font-medium uppercase tracking-[0.18em]">
                      Preferred Date *
                    </label>
                    <input
                      id="visit-date"
                      type="date"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="visit-time" className="block text-xs font-medium uppercase tracking-[0.18em]">
                      Time Window
                    </label>
                    <select
                      id="visit-time"
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                    >
                      <option value="Morning (09:00 – 12:00)">Morning (09:00 – 12:00)</option>
                      <option value="Midday (12:00 – 15:00)">Midday (12:00 – 15:00)</option>
                      <option value="Afternoon (15:00 – 18:00)">Afternoon (15:00 – 18:00)</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2 border-t border-[hsl(var(--border))] pt-6">
                  <DubaiLocationPicker
                    onSelectLocation={({ area, city }) => {
                      if (area) setLocationArea(area);
                      if (city) setLocationCity(city);
                    }}
                  />
                </div>
              </div>

              <div className="mt-8">
                <p className="block text-xs font-medium uppercase tracking-[0.18em]">
                  Areas Requiring Inspection
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {VISIT_SERVICES.map((item) => {
                    const selected = services.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleService(item)}
                        className={`flex min-h-[46px] items-center justify-between gap-2 border px-4 py-2 text-left text-xs transition-colors ${
                          selected
                            ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                            : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground))]'
                        }`}
                      >
                        <span>{item}</span>
                        {selected && <Check className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="visit-notes" className="block text-xs font-medium uppercase tracking-[0.18em]">
                  Site Notes &amp; Access Instructions
                </label>
                <textarea
                  id="visit-notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share gate access requirements, building management pass needs, or specific issues to inspect."
                  className="mt-2 w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                />
              </div>

              <div className="mt-6">
                <p className="block text-xs font-medium uppercase tracking-[0.18em]">
                  Attach Drawings or Photos (Optional)
                </p>
                <label className="mt-2 flex min-h-[96px] cursor-pointer items-center justify-center gap-3 border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-4 text-sm hover:border-[hsl(var(--foreground))]">
                  <FileUp className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
                  <span>{uploading ? 'Uploading files...' : 'Upload site plans or photos'}</span>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="sr-only"
                  />
                </label>
                {attachments.length > 0 && (
                  <ul className="mt-3 divide-y divide-[hsl(var(--border))] border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                    {attachments.map((file) => (
                      <li key={file.filename} className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs">
                        <a href={file.url} target="_blank" rel="noreferrer" className="truncate underline">
                          {file.originalName}
                        </a>
                        <button
                          type="button"
                          aria-label={`Remove ${file.originalName}`}
                          onClick={() =>
                            setAttachments((prev) => prev.filter((a) => a.filename !== file.filename))
                          }
                          className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="inline-flex min-h-[48px] items-center justify-center bg-[hsl(var(--accent))] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)] transition-colors hover:bg-[hsl(33_33%_39%)] disabled:opacity-50"
                >
                  {submitting ? 'Booking Site Visit...' : 'Confirm Site Visit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <CTASection
        label="Full Scope Submission"
        headline="Ready to Submit a Detailed Quotation Brief?"
        copy="Use the eight-step quotation form if you already have full dimensions, drawings, and material schedules."
        primaryLabel="Request a Quotation"
        primaryTo="/request-a-quote"
        secondaryLabel="Contact Office"
        secondaryTo="/contact-us"
      />
    </>
  );
}
