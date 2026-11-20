import type { AttachmentFile, EmailLogRecord, Lead, LeadStatus, Project, ProjectCategory } from '../types';

export interface CreateLeadPayload {
  enquiry_type: 'quote' | 'site_visit' | 'amc' | 'contact';
  name: string;
  company?: string;
  phone: string;
  email?: string;
  services: string[];
  property_type?: string;
  location_area?: string;
  location_city?: string;
  location_address?: string;
  project_status?: string;
  description: string;
  project_size_area?: string;
  project_size_floors?: string;
  project_size_estimate?: string;
  preferred_start_date?: string;
  attachments?: AttachmentFile[];
  preferred_visit_date?: string;
  preferred_visit_time?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data as T;
}

export async function uploadAttachments(files: File[]): Promise<AttachmentFile[]> {
  if (files.length === 0) return [];
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  const res = await fetch('/api/uploads', {
    method: 'POST',
    body: formData,
  });
  const data = await handleResponse<{ files: AttachmentFile[] }>(res);
  return data.files;
}

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ lead: Lead }>(res);
  return data.lead;
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  const data = await handleResponse<{ projects: Project[] }>(res);
  return data.projects;
}

export async function getAdminSession(): Promise<{ authenticated: boolean; email?: string }> {
  const res = await fetch('/api/auth/me');
  return handleResponse<{ authenticated: boolean; email?: string }>(res);
}

export async function loginAdmin(email: string, password: string): Promise<{ authenticated: boolean; email: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ authenticated: boolean; email: string }>(res);
}

export async function logoutAdmin(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export async function fetchAdminLeads(status?: string, q?: string): Promise<{
  leads: Lead[];
  counts: Record<string, number>;
}> {
  const params = new URLSearchParams();
  if (status && status !== 'ALL') params.set('status', status);
  if (q) params.set('q', q);
  const queryStr = params.toString();
  const res = await fetch(`/api/leads${queryStr ? `?${queryStr}` : ''}`);
  return handleResponse<{ leads: Lead[]; counts: Record<string, number> }>(res);
}

export async function updateAdminLead(
  id: string,
  payload: { lead_status?: LeadStatus; notes?: string }
): Promise<Lead> {
  const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ lead: Lead }>(res);
  return data.lead;
}

export interface ProjectFormPayload {
  name: string;
  location: string;
  category: ProjectCategory;
  scope: string;
  short_description: string;
  before_image: string;
  after_image: string;
  featured: boolean;
}

export async function createAdminProject(payload: ProjectFormPayload): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ project: Project }>(res);
  return data.project;
}

export async function updateAdminProject(id: string, payload: Partial<ProjectFormPayload>): Promise<Project> {
  const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ project: Project }>(res);
  return data.project;
}

export async function deleteAdminProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  await handleResponse<{ deleted: boolean }>(res);
}

export async function fetchAdminEmailLogs(): Promise<{
  logs: EmailLogRecord[];
  smtpConfigured: boolean;
  notificationEmail: string;
}> {
  const res = await fetch('/api/email-logs');
  return handleResponse<{
    logs: EmailLogRecord[];
    smtpConfigured: boolean;
    notificationEmail: string;
  }>(res);
}

export async function resendLeadEmail(leadId: string): Promise<{
  log: EmailLogRecord;
  lead: Lead;
}> {
  const res = await fetch(`/api/email-logs/${encodeURIComponent(leadId)}/resend`, {
    method: 'POST',
  });
  return handleResponse<{ log: EmailLogRecord; lead: Lead }>(res);
}

export async function fetchMapsConfig(): Promise<{ apiKey: string }> {
  const res = await fetch('/api/maps/config');
  return handleResponse<{ apiKey: string }>(res);
}

export type ChatModelChoice =
  | 'gemini-4-hydrogen'
  | 'gemini-3.1-flash-lite'
  | 'gemini-4-neon'
  | 'gemini-4-carbon';

export interface ChatTurnMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatApiResponse {
  text: string;
  model: ChatModelChoice;
  sources: GroundingSource[];
  searchGrounded: boolean;
}

export async function sendTechnicalChat(params: {
  messages: ChatTurnMessage[];
  model: ChatModelChoice;
  useSearch: boolean;
}): Promise<ChatApiResponse> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return handleResponse<ChatApiResponse>(res);
}

export async function runSearchLookup(query: string): Promise<{
  text: string;
  model: string;
  sources: GroundingSource[];
}> {
  const res = await fetch('/api/gemini/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return handleResponse<{ text: string; model: string; sources: GroundingSource[] }>(res);
}
