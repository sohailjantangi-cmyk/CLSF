import { useState } from 'react';
import {
  Building2,
  Check,
  Dumbbell,
  FileUp,
  Home,
  Hotel,
  Layers,
  Store,
  Trash2,
  Warehouse,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { createLead, uploadAttachments } from '../lib/api';
import type { AttachmentFile, Lead } from '../types';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { DubaiLocationPicker } from '../components/DubaiLocationPicker';
import { EnquiryConfirmation } from '../components/EnquiryConfirmation';
import { CTASection } from '../components/CTASection';

const SERVICE_OPTIONS = [
  'Building/Construction',
  'Villa Renovation',
  'Extension/Modification',
  'Interior Fit-Out',
  'MEP',
  'HVAC/AC',
  'Electrical',
  'Plumbing',
  'Swimming Pool',
  'Maintenance/AMC',
  'Cleaning',
  'Other',
];

const PROPERTY_OPTIONS = [
  { label: 'Villa', icon: Home },
  { label: 'Apartment', icon: Hotel },
  { label: 'Office', icon: Building2 },
  { label: 'Retail/Showroom', icon: Store },
  { label: 'Gym', icon: Dumbbell },
  { label: 'Warehouse', icon: Warehouse },
  { label: 'Commercial Property', icon: Building2 },
  { label: 'Other', icon: Layers },
];

const STATUS_OPTIONS = [
  'Planning stage',
  'Ready to start',
  'Under renovation',
  'Existing problem requiring inspection',
  'Looking for maintenance',
  'Other',
];

const STEP_LABELS = [
  'Services Needed',
  'Property Type',
  'Location',
  'Project Status',
  'Requirement Description',
  'Project Size (Optional)',
  'Contact Details',
  'Attachments',
];

export function RequestQuotePage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState('');
  const [locationArea, setLocationArea] = useState('');
  const [locationCity, setLocationCity] = useState('Dubai');
  const [locationAddress, setLocationAddress] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [description, setDescription] = useState('');
  const [sizeArea, setSizeArea] = useState('');
  const [sizeFloors, setSizeFloors] = useState('');
  const [sizeEstimate, setSizeEstimate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
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

  function isStepValid(): boolean {
    switch (step) {
      case 1:
        return services.length > 0;
      case 2:
        return propertyType !== '';
      case 3:
        return locationArea.trim().length > 0 && locationCity.trim().length > 0;
      case 4:
        return projectStatus !== '';
      case 5:
        return description.trim().length >= 5;
      case 6:
        return true;
      case 7:
        return name.trim().length > 0 && phone.trim().length >= 6;
      case 8:
        return !uploading;
      default:
        return false;
    }
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

  async function handleSubmit() {
    if (!isStepValid()) return;
    setSubmitting(true);
    setError(null);
    try {
      const lead = await createLead({
        enquiry_type: 'quote',
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        email: email.trim(),
        services,
        property_type: propertyType,
        location_area: locationArea.trim(),
        location_city: locationCity.trim(),
        location_address: locationAddress.trim(),
        project_status: projectStatus,
        description: description.trim(),
        project_size_area: sizeArea.trim(),
        project_size_floors: sizeFloors.trim(),
        project_size_estimate: sizeEstimate.trim(),
        preferred_start_date: startDate.trim(),
        attachments,
      });
      setSubmittedLead(lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit quotation request.');
    } finally {
      setSubmitting(false);
    }
  }

  const progressPct = Math.round((step / 8) * 100);

  return (
    <>
      <Seo
        title="Request a Quotation | CLSF Building Contracting Dubai"
        description="Submit your Dubai building construction, renovation, interior fit-out, MEP, or maintenance scope to receive a structured Bill of Quantities quotation from CLSF."
        path="/request-a-quote"
      />

      <PageHero
        label="Quotation Intake"
        title="Request a Structured Quotation"
        intro="Complete the eight-step technical brief below so our estimating engineers can review your scope, property type, and drawings prior to issuing a measured quotation."
        breadcrumbs={[{ label: 'Request a Quotation' }]}
      />

      <section className="bg-[hsl(var(--background))] py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          {submittedLead ? (
            <EnquiryConfirmation lead={submittedLead} />
          ) : (
            <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 sm:p-10">
              {/* Progress header */}
              <div className="border-b border-[hsl(var(--border))] pb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="tabular-nums section-label">
                    Step {step} of 8 — {STEP_LABELS[step - 1]}
                  </p>
                  <p className="tabular-nums text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    {progressPct}%
                  </p>
                </div>
                <div className="mt-4 h-1.5 w-full bg-[hsl(var(--muted))]">
                  <div
                    className="h-full bg-[hsl(var(--accent))] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {error && (
                <div role="alert" className="mt-6 border border-[hsl(var(--accent))] bg-[hsl(var(--muted))] p-4 text-sm text-[hsl(var(--foreground))]">
                  {error}
                </div>
              )}

              {/* Step Content */}
              <div className="py-8">
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-medium text-[hsl(var(--foreground))] sm:text-2xl">
                      Which services do you require?
                    </h2>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      Select one or more divisions applicable to your property.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {SERVICE_OPTIONS.map((item) => {
                        const selected = services.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleService(item)}
                            className={`flex min-h-[52px] items-center justify-between gap-3 border px-4 py-3 text-left text-sm transition-colors ${
                              selected
                                ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                                : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground))]'
                            }`}
                          >
                            <span>{item}</span>
                            {selected && <Check className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-medium text-[hsl(var(--foreground))] sm:text-2xl">
                      What type of property is the project for?
                    </h2>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      Select the property classification so we apply the right authority and site logistics checks.
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {PROPERTY_OPTIONS.map((item) => {
                        const Icon = item.icon;
                        const selected = propertyType === item.label;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setPropertyType(item.label)}
                            className={`flex min-h-[104px] flex-col items-start justify-between border p-4 text-left transition-colors ${
                              selected
                                ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                                : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground))]'
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                selected ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted-foreground))]'
                              }`}
                              aria-hidden="true"
                            />
                            <span className="mt-4 text-sm font-medium">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-medium text-[hsl(var(--foreground))] sm:text-2xl">
                      Where is the property located?
                    </h2>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      Community or district and emirate are required to determine access permits.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="quote-area" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Community / Area *
                        </label>
                        <input
                          id="quote-area"
                          type="text"
                          required
                          value={locationArea}
                          onChange={(e) => setLocationArea(e.target.value)}
                          placeholder="e.g. Dubai Hills, Business Bay, Deira"
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="quote-city" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          City / Emirate *
                        </label>
                        <input
                          id="quote-city"
                          type="text"
                          required
                          value={locationCity}
                          onChange={(e) => setLocationCity(e.target.value)}
                          placeholder="Dubai"
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="quote-address" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Plot / Building / Unit Address (Optional)
                        </label>
                        <input
                          id="quote-address"
                          type="text"
                          value={locationAddress}
                          onChange={(e) => setLocationAddress(e.target.value)}
                          placeholder="Villa number, tower name, or street"
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2 border-t border-[hsl(var(--border))] pt-6">
                        <DubaiLocationPicker
                          onSelectLocation={({ area, city, address }) => {
                            if (area) setLocationArea(area);
                            if (city) setLocationCity(city);
                            if (address) setLocationAddress(address);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-medium text-[hsl(var(--foreground))] sm:text-2xl">
                      What is the current status of the project?
                    </h2>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {STATUS_OPTIONS.map((item) => {
                        const selected = projectStatus === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setProjectStatus(item)}
                            className={`flex min-h-[54px] items-center justify-between gap-3 border px-5 py-3 text-left text-sm transition-colors ${
                              selected
                                ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                                : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground))]'
                            }`}
                          >
                            <span>{item}</span>
                            {selected && <Check className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="text-xl font-medium text-[hsl(var(--foreground))] sm:text-2xl">
                      Describe the required scope of work
                    </h2>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      Include rooms or zones affected, structural changes, MEP requirements, or maintenance issues observed.
                    </p>
                    <div className="mt-6">
                      <label htmlFor="quote-desc" className="sr-only">
                        Requirement Description
                      </label>
                      <textarea
                        id="quote-desc"
                        rows={6}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Example: Full strip-out renovation of 4-bedroom villa including 4 bathrooms, kitchen relocation, new chilled water FCUs, and shadow-gap gypsum ceilings."
                        className="w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <h2 className="text-xl font-medium text-[hsl(var(--foreground))] sm:text-2xl">
                      Approximate project dimensions and timeline
                    </h2>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      All fields on this step are optional. Leave blank if measurements will be taken during a site survey.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="quote-sqft" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Area (sq ft)
                        </label>
                        <input
                          id="quote-sqft"
                          type="text"
                          value={sizeArea}
                          onChange={(e) => setSizeArea(e.target.value)}
                          placeholder="e.g. 3,500"
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="quote-floors" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Number of Floors / Levels
                        </label>
                        <input
                          id="quote-floors"
                          type="text"
                          value={sizeFloors}
                          onChange={(e) => setSizeFloors(e.target.value)}
                          placeholder="e.g. G+1"
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="quote-estimate" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Size / Budget Estimate
                        </label>
                        <input
                          id="quote-estimate"
                          type="text"
                          value={sizeEstimate}
                          onChange={(e) => setSizeEstimate(e.target.value)}
                          placeholder="e.g. Full floorplate / target budget range"
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="quote-start" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Expected Start Date
                        </label>
                        <input
                          id="quote-start"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div>
                    <h2 className="text-xl font-medium text-[hsl(var(--foreground))] sm:text-2xl">
                      Contact details for the quotation
                    </h2>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      Your name and telephone number are required so our project engineer can coordinate follow-up questions.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="quote-name" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Full Name *
                        </label>
                        <input
                          id="quote-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="quote-phone" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Phone Number *
                        </label>
                        <input
                          id="quote-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+971 5X XXX XXXX"
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="quote-company" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Company (Optional)
                        </label>
                        <input
                          id="quote-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="quote-email" className="block text-xs font-medium uppercase tracking-[0.18em]">
                          Email Address (Optional)
                        </label>
                        <input
                          id="quote-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 8 && (
                  <div>
                    <h2 className="text-xl font-medium text-[hsl(var(--foreground))] sm:text-2xl">
                      Attach drawings, BOQs, or site photographs
                    </h2>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                      Optional. Uploaded files are stored via direct public URLs so our estimating team can open them directly from your reference summary.
                    </p>

                    <label className="mt-6 flex min-h-[140px] cursor-pointer flex-col items-center justify-center border border-dashed border-[hsl(var(--foreground))] bg-[hsl(var(--background))] p-6 text-center transition-colors hover:bg-[hsl(var(--muted))]">
                      <FileUp className="h-6 w-6 text-[hsl(var(--accent))]" aria-hidden="true" />
                      <span className="mt-3 text-sm font-medium text-[hsl(var(--foreground))]">
                        {uploading ? 'Uploading files...' : 'Select PDF drawings, spreadsheets, or images'}
                      </span>
                      <span className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                        Multiple files supported (up to 15 MB per file)
                      </span>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="sr-only"
                      />
                    </label>

                    {attachments.length > 0 && (
                      <ul className="mt-6 divide-y divide-[hsl(var(--border))] border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                        {attachments.map((file) => (
                          <li key={file.filename} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate underline underline-offset-4 hover:text-[hsl(var(--accent))]"
                            >
                              {file.originalName}
                            </a>
                            <button
                              type="button"
                              aria-label={`Remove ${file.originalName}`}
                              onClick={() =>
                                setAttachments((prev) => prev.filter((a) => a.filename !== file.filename))
                              }
                              className="flex h-9 w-9 shrink-0 items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between gap-4 border-t border-[hsl(var(--border))] pt-6">
                <button
                  type="button"
                  disabled={step === 1 || submitting}
                  onClick={() => {
                    setError(null);
                    setStep((s) => Math.max(1, s - 1));
                  }}
                  className="inline-flex min-h-[48px] items-center justify-center border border-[hsl(var(--border))] px-6 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--foreground))] disabled:opacity-40"
                >
                  Back
                </button>

                {step < 8 ? (
                  <button
                    type="button"
                    disabled={!isStepValid()}
                    onClick={() => {
                      setError(null);
                      setStep((s) => Math.min(8, s + 1));
                    }}
                    className="inline-flex min-h-[48px] items-center justify-center bg-[hsl(var(--foreground))] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))] transition-colors hover:bg-[hsl(var(--accent))] disabled:opacity-40"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!isStepValid() || submitting}
                    onClick={handleSubmit}
                    className="inline-flex min-h-[48px] items-center justify-center bg-[hsl(var(--accent))] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)] transition-colors hover:bg-[hsl(33_33%_39%)] disabled:opacity-40"
                  >
                    {submitting ? 'Submitting Enquiry...' : 'Submit Quotation Request'}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[hsl(var(--border))] pt-6 text-xs text-[hsl(var(--muted-foreground))]">
            <span>Direct Estimating Desk: {BUSINESS_INFO.phone}</span>
            <span>Email: {BUSINESS_INFO.email}</span>
          </div>
        </div>
      </section>

      <CTASection
        label="Prefer an Inspection First"
        headline="Book an On-Site Technical Survey"
        copy="Have a CLSF site engineer inspect the property before preparing your scope and BOQ."
        primaryLabel="Book a Site Visit"
        primaryTo="/site-visit"
        secondaryLabel="Contact Office"
        secondaryTo="/contact-us"
      />
    </>
  );
}
