export const BUSINESS_INFO = {
  name: 'CLSF Building Contracting',
  shortName: 'CLSF',
  tagline: 'Building Contracting',
  address: 'Office 55, Tanvi Business Center, Al Maktoum Road, Port Saeed, Deira, Dubai',
  phone: '+971564080255',
  phoneHref: 'tel:+971564080255',
  email: 'info@clsfae.com',
  emailHref: 'mailto:info@clsfae.com',
  serviceArea: 'Dubai and the wider UAE',
  domain: 'https://clsfae.com',
  positioning: 'Build · Renovate · Fit-Out · Maintain — residential and commercial.',
} as const;

export const PROCESS_STAGES = [
  {
    number: '01',
    title: 'Consultation',
    summary: 'Initial technical discussion to establish property condition, functional brief, and commercial objectives.',
  },
  {
    number: '02',
    title: 'Site Assessment',
    summary: 'Physical survey of structural bays, MEP capacities, existing drainage falls, and site access logistics.',
  },
  {
    number: '03',
    title: 'Scope & BOQ',
    summary: 'Itemised Bill of Quantities defining material specifications, provisional allowances, and fixed stage milestones.',
  },
  {
    number: '04',
    title: 'Coordination',
    summary: 'Authority NOC submissions, master developer approvals, shop drawings, and trade sequencing prior to mobilisation.',
  },
  {
    number: '05',
    title: 'Execution',
    summary: 'Supervised site works across civil, MEP, and interior finishing with staged hold-point testing.',
  },
  {
    number: '06',
    title: 'Inspection & Handover',
    summary: 'Joint snagging walk-through, commissioning certificates, as-built documentation, and defects liability support.',
  },
] as const;

export const QUALITY_PILLARS = [
  {
    number: '01',
    title: 'One Contract, One Sequence',
    description: 'Civil, MEP, joinery, and finishing trades operate under a single master programme so first-fix services never clash with wet trades or ceilings.',
  },
  {
    number: '02',
    title: 'Scope Defined Before Pricing',
    description: 'Every quotation is backed by a measured Bill of Quantities with clear exclusions, material schedules, and milestone drawdowns.',
  },
  {
    number: '03',
    title: 'Approvals Built Into the Plan',
    description: 'Dubai Municipality, master developer NOCs, and Civil Defence requirements are mapped before site mobilisation begins.',
  },
  {
    number: '04',
    title: 'Inspection at Every Stage',
    description: 'Waterproofing flood tests, pipework pressure logs, electrical insulation checks, and structured snagging precede every handover.',
  },
] as const;

export const PROPERTY_TYPES = [
  { label: 'Villa', description: 'G+1 residences, townhouses, and private plots across freehold and leasehold communities.' },
  { label: 'Apartment', description: 'Full strip-out renovations, wet area waterproofing upgrades, and MEP modernisation.' },
  { label: 'Office', description: 'Shell-and-core and Category A/B commercial workspaces with acoustic and MEP compliance.' },
  { label: 'Retail & Showroom', description: 'High-traffic display floors, custom joinery, lighting grids, and authority-ready fit-outs.' },
  { label: 'Gym & Studio', description: 'Reinforced sub-floors, acoustic isolation, high-capacity fresh air ventilation, and wet areas.' },
  { label: 'Warehouse', description: 'Mezzanine modifications, industrial flooring, electrical distribution, and fire-safety upgrades.' },
  { label: 'Commercial Property', description: 'Multi-unit buildings, common areas, plant rooms, and planned Annual Maintenance Contracts.' },
] as const;

export const HERO_SLIDES = [
  {
    image: '/src/assets/images/hero_villa_construction_1795167605296.jpg',
    alt: 'Contemporary private villa in Dubai constructed with board-formed concrete and travertine stone',
    caption: 'Villa Construction & Structural Contracting',
  },
  {
    image: '/src/assets/images/hero_commercial_fitout_1795167605424.jpg',
    alt: 'Completed commercial office fit-out in Dubai featuring charcoal steel partitions and walnut joinery',
    caption: 'Commercial Interior Fit-Out & Joinery',
  },
  {
    image: '/src/assets/images/hero_mep_systems_1795167608928.jpg',
    alt: 'Mechanical plant room with insulated chilled water manifolds and galvanized HVAC ductwork',
    caption: 'MEP Engineering, HVAC & Building Maintenance',
  },
] as const;
