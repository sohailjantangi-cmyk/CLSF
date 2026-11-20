import { BUSINESS_INFO } from '../data/business';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { CTASection } from '../components/CTASection';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'cookies';
}

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    path: '/privacy-policy',
    description: 'Privacy policy detailing how CLSF Building Contracting handles project enquiry data and uploaded drawings.',
    intro: 'How CLSF Building Contracting collects, stores, and protects contact details and project documentation submitted through this website.',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'When you submit a quotation request, site visit booking, or contact enquiry, we collect your name, company name (where provided), telephone number, email address, property location, project scope notes, and any drawings or photographs you choose to attach.',
      },
      {
        heading: '2. How We Use Enquiry Information',
        body: 'Submitted details are used solely to review your construction, fit-out, MEP, or maintenance requirements, arrange site assessments, prepare Bills of Quantities, and communicate regarding your project.',
      },
      {
        heading: '3. Uploaded Attachments',
        body: 'Files uploaded through the quotation or site-visit forms are stored via unique direct links so our engineering and estimating teams can inspect drawings, BOQs, and site photographs. Do not upload sensitive personal identity documents through public project attachment fields.',
      },
      {
        heading: '4. Data Retention & Third-Party Mapping Services',
        body: `We retain enquiry records for commercial administration and active project correspondence. Optional address lookup and interactive office maps integrate Google Maps Platform features, which are subject to Google Privacy Policy practices. To request access to or deletion of your enquiry details, email ${BUSINESS_INFO.email} or write to ${BUSINESS_INFO.address}.`,
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    path: '/terms-and-conditions',
    description: 'Website terms and conditions for CLSF Building Contracting, Dubai, United Arab Emirates.',
    intro: 'Terms governing use of the CLSF Building Contracting website and preliminary quotation submissions.',
    sections: [
      {
        heading: '1. Preliminary Nature of Online Enquiries',
        body: 'Submitting a quotation request or site visit form through this website constitutes an invitation to assess scope. No binding construction, fit-out, or maintenance contract is formed until a formal written agreement and measured Bill of Quantities are signed by both parties.',
      },
      {
        heading: '2. Site Surveys & Authority Approvals',
        body: 'Final pricing and delivery schedules depend on physical site verification, existing structural and MEP conditions, and applicable Dubai Municipality, master developer, or Civil Defence approvals.',
      },
      {
        heading: '3. Intellectual Property',
        body: 'All technical descriptions, service specifications, and visual materials published on this website belong to CLSF Building Contracting and may not be republished without written permission.',
      },
      {
        heading: '4. Mapping & Location Features',
        body: 'This website integrates Google Maps Platform mapping and place-selection features. By using those mapping features, users are bound by the Google Maps/Google Earth Additional Terms of Service and the Google Privacy Policy.',
      },
      {
        heading: '5. Governing Law',
        body: 'These website terms are governed by the applicable laws of the Emirate of Dubai and the United Arab Emirates.',
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    path: '/cookie-policy',
    description: 'Cookie usage policy for CLSF Building Contracting.',
    intro: 'Details on essential session cookies and browser storage used by the CLSF Building Contracting website.',
    sections: [
      {
        heading: '1. Essential Cookies Only',
        body: 'This website uses strictly necessary session cookies strictly where required for authenticated administration access and secure form operation. No third-party advertising trackers or behavioural profiling cookies are deployed.',
      },
      {
        heading: '2. Managing Browser Preferences',
        body: 'You may restrict or clear cookies in your browser settings at any time. Disabling essential cookies does not affect browsing public service pages or submitting quotation enquiries.',
      },
      {
        heading: '3. Questions',
        body: `Any questions regarding this cookie policy may be directed to ${BUSINESS_INFO.email}.`,
      },
    ],
  },
};

export function LegalPage({ type }: LegalPageProps) {
  const content = LEGAL_CONTENT[type];

  return (
    <>
      <Seo title={`${content.title} | ${BUSINESS_INFO.name}`} description={content.description} path={content.path} />

      <PageHero
        label="Governance"
        title={content.title}
        intro={content.intro}
        breadcrumbs={[{ label: content.title }]}
      />

      <section className="bg-[hsl(var(--background))] py-20 lg:py-24">
        <div className="mx-auto max-w-4xl space-y-10 px-6 lg:px-10">
          {content.sections.map((section) => (
            <div key={section.heading} className="border-b border-[hsl(var(--border))] pb-8">
              <h2 className="text-xl font-medium text-[hsl(var(--foreground))]">{section.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        headline="Discuss Your Project With CLSF"
        copy="Contact our Dubai office directly or submit your project scope for review."
      />
    </>
  );
}
