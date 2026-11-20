import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { createLead } from '../lib/api';
import type { Lead } from '../types';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { SectionHeading } from '../components/SectionHeading';
import { DubaiOfficeMap } from '../components/DubaiOfficeMap';
import { EnquiryConfirmation } from '../components/EnquiryConfirmation';
import { CTASection } from '../components/CTASection';

export function ContactPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Contracting Enquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please complete your name, phone number, and message.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const lead = await createLead({
        enquiry_type: 'contact',
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        email: email.trim(),
        services: [subject],
        location_city: 'Dubai',
        description: message.trim(),
      });
      setSubmittedLead(lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send message.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Contact CLSF Building Contracting | Port Saeed, Deira, Dubai"
        description="Contact CLSF Building Contracting in Port Saeed, Deira, Dubai on +971564080255 or info@clsfae.com to discuss construction, fit-out, MEP, or building maintenance."
        path="/contact-us"
      />

      <PageHero
        label="Contact"
        title="Speak With Our Engineering & Estimating Desk"
        intro="Reach our Dubai office directly by telephone or email, or use the structured enquiry routes for measured quotations and site visits."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <section className="bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-10">
          <div className="space-y-8 lg:col-span-5">
            <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8">
              <p className="section-label">Head Office</p>
              <h2 className="mt-3 text-2xl font-medium text-[hsl(var(--foreground))]">
                {BUSINESS_INFO.name}
              </h2>

              <dl className="mt-8 space-y-6 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                      Office Address
                    </dt>
                    <dd className="mt-1 leading-relaxed text-[hsl(var(--foreground))]">
                      {BUSINESS_INFO.address}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                      Telephone
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={BUSINESS_INFO.phoneHref}
                        className="tabular-nums font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]"
                      >
                        {BUSINESS_INFO.phone}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={BUSINESS_INFO.emailHref}
                        className="font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]"
                      >
                        {BUSINESS_INFO.email}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-8 border-t border-[hsl(var(--border))] pt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                  Service Area
                </p>
                <p className="mt-1 text-sm text-[hsl(var(--foreground))]">
                  {BUSINESS_INFO.serviceArea}
                </p>
              </div>
            </div>

            <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8">
              <p className="section-label">Structured Enquiries</p>
              <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                For a detailed Bill of Quantities quotation or to schedule an engineer on site, use our dedicated intake forms.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/request-a-quote"
                  className="inline-flex min-h-[48px] items-center justify-between bg-[hsl(var(--foreground))] px-5 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))] transition-colors hover:bg-[hsl(var(--accent))]"
                >
                  <span>8-Step Quotation Form</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/site-visit"
                  className="inline-flex min-h-[48px] items-center justify-between border border-[hsl(var(--border))] px-5 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--foreground))]"
                >
                  <span>Book a Site Visit</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {submittedLead ? (
              <EnquiryConfirmation lead={submittedLead} />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 lg:p-10"
              >
                <p className="section-label">Direct Message</p>
                <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[hsl(var(--foreground))]">
                  Send an Enquiry
                </h2>

                {error && (
                  <div role="alert" className="mt-6 border border-[hsl(var(--accent))] bg-[hsl(var(--muted))] p-4 text-sm text-[hsl(var(--foreground))]">
                    {error}
                  </div>
                )}

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))]">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm text-[hsl(var(--foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className="block text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))]">
                      Company (Optional)
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm text-[hsl(var(--foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))]">
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 5X XXX XXXX"
                      className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm text-[hsl(var(--foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))]">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm text-[hsl(var(--foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="contact-subject" className="block text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))]">
                    Enquiry Division
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm text-[hsl(var(--foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none"
                  >
                    <option value="General Contracting Enquiry">General Contracting Enquiry</option>
                    <option value="Villa Construction / Extension">Villa Construction / Extension</option>
                    <option value="Interior Fit-Out & Renovation">Interior Fit-Out &amp; Renovation</option>
                    <option value="MEP & HVAC Engineering">MEP &amp; HVAC Engineering</option>
                    <option value="Building Maintenance / AMC">Building Maintenance / AMC</option>
                  </select>
                </div>

                <div className="mt-6">
                  <label htmlFor="contact-message" className="block text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))]">
                    Project Summary *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Briefly describe the property location, work required, and preferred timeline."
                    className="mt-2 w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-sm text-[hsl(var(--foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-[48px] w-full items-center justify-center bg-[hsl(var(--accent))] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)] transition-colors hover:bg-[hsl(33_33%_39%)] disabled:opacity-50 sm:w-auto"
                  >
                    {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            label="Location & Dispatch"
            title="Port Saeed, Deira Head Office & Dubai Service Zones"
            description="Inspect our office location in Port Saeed, Deira and primary engineering dispatch corridors across Business Bay, Dubai Hills, Al Quoz, and Dubai Marina."
          />
          <div className="mt-10">
            <DubaiOfficeMap />
          </div>
        </div>
      </section>

      <CTASection
        headline="Have Drawings or Site Photos Ready?"
        copy="Use our 8-step quotation intake to attach architectural plans, schedules, or site photographs."
      />
    </>
  );
}
