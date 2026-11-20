export type EnquiryType = 'quote' | 'site_visit' | 'amc' | 'contact';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'SITE_VISIT_REQUIRED'
  | 'QUOTATION_IN_PROGRESS'
  | 'QUOTATION_SENT'
  | 'FOLLOW_UP'
  | 'WON'
  | 'LOST';

export type ProjectCategory =
  | 'Villas'
  | 'Renovation'
  | 'Interior Fit-Out'
  | 'MEP'
  | 'Swimming Pools'
  | 'Maintenance'
  | 'Commercial'
  | 'Other';

export interface AttachmentFile {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
}

export type EmailDispatchStatus = 'sent' | 'pending_smtp' | 'failed';

export interface EmailLogRecord {
  id: string;
  to: string;
  subject: string;
  lead_id: string;
  dispatched_at: string;
  mode: string;
  status: EmailDispatchStatus;
  messageId?: string;
  error?: string;
  bodyText?: string;
}

export interface Lead {
  id: string;
  lead_id: string;
  enquiry_type: EnquiryType;
  name: string;
  company: string;
  phone: string;
  email: string;
  services: string[];
  property_type: string;
  location_area: string;
  location_city: string;
  location_address: string;
  project_status: string;
  description: string;
  project_size_area: string;
  project_size_floors: string;
  project_size_estimate: string;
  preferred_start_date: string;
  attachments: AttachmentFile[];
  preferred_visit_date: string;
  preferred_visit_time: string;
  lead_status: LeadStatus;
  email_status?: EmailDispatchStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  category: ProjectCategory;
  scope: string;
  short_description: string;
  before_image: string;
  after_image: string;
  featured: boolean;
  order?: number;
}

export interface ServiceRecord {
  title: string;
  slug: string;
  number: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  approved: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ChildService {
  title: string;
  slug: string;
  summary: string;
  covers: string[];
  delivery: string[];
  deliverables: string[];
  faqs: FaqItem[];
  image: string;
}

export interface ServiceCategory {
  number: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  qualityPoints: { title: string; detail: string }[];
  faqs: FaqItem[];
  children: ChildService[];
}
