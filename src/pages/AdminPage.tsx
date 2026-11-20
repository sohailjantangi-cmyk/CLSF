import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { LogOut, Mail, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import {
  createAdminProject,
  deleteAdminProject,
  fetchAdminEmailLogs,
  fetchAdminLeads,
  fetchProjects,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  resendLeadEmail,
  updateAdminLead,
  updateAdminProject,
  type ProjectFormPayload,
} from '../lib/api';
import type { EmailLogRecord, Lead, LeadStatus, Project, ProjectCategory } from '../types';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';

const LEAD_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'SITE_VISIT_REQUIRED',
  'QUOTATION_IN_PROGRESS',
  'QUOTATION_SENT',
  'FOLLOW_UP',
  'WON',
  'LOST',
];

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Villas',
  'Renovation',
  'Interior Fit-Out',
  'MEP',
  'Swimming Pools',
  'Maintenance',
  'Commercial',
  'Other',
];

const IMAGE_PRESETS = [
  { label: 'Villa Construction', url: '/src/assets/images/hero_villa_construction_1795167605296.jpg' },
  { label: 'Commercial Fit-Out', url: '/src/assets/images/hero_commercial_fitout_1795167605424.jpg' },
  { label: 'MEP & Plant Room', url: '/src/assets/images/hero_mep_systems_1795167608928.jpg' },
  { label: 'Interior Finishing', url: '/src/assets/images/cat_interior_finishing_1795167609084.jpg' },
  { label: 'Swimming Pool', url: '/src/assets/images/cat_pool_maintenance_1795167608879.jpg' },
  { label: 'Villa Extension', url: '/src/assets/images/cat_villa_extension_1795167608645.jpg' },
];

const EMPTY_PROJECT_FORM: ProjectFormPayload = {
  name: '',
  location: '',
  category: 'Villas',
  scope: '',
  short_description: '',
  before_image: IMAGE_PRESETS[0].url,
  after_image: IMAGE_PRESETS[0].url,
  featured: false,
};

export function AdminPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<'leads' | 'emails' | 'projects'>('leads');

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState<LeadStatus>('NEW');
  const [editNotes, setEditNotes] = useState('');
  const [savingLead, setSavingLead] = useState(false);
  const [leadNotice, setLeadNotice] = useState<string | null>(null);

  // Email dispatch state
  const [emailLogs, setEmailLogs] = useState<EmailLogRecord[]>([]);
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [resendingLeadId, setResendingLeadId] = useState<string | null>(null);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormPayload>(EMPTY_PROJECT_FORM);
  const [savingProject, setSavingProject] = useState(false);
  const [projectNotice, setProjectNotice] = useState<string | null>(null);

  useEffect(() => {
    getAdminSession()
      .then((res) => {
        setAuthenticated(res.authenticated);
        setAdminEmail(res.email || '');
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const loadLeads = useCallback(async () => {
    try {
      const data = await fetchAdminLeads(statusFilter, searchQuery);
      setLeads(data.leads);
      setCounts(data.counts);
      if (selectedLead) {
        const updated = data.leads.find((l) => l.id === selectedLead.id);
        if (updated) {
          setSelectedLead(updated);
          setEditStatus(updated.lead_status);
          setEditNotes(updated.notes);
        }
      } else if (data.leads.length > 0) {
        setSelectedLead(data.leads[0]);
        setEditStatus(data.leads[0].lead_status);
        setEditNotes(data.leads[0].notes);
      }
    } catch {
      // handled cleanly
    }
  }, [statusFilter, searchQuery, selectedLead]);

  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch {
      // handled cleanly
    }
  }, []);

  const loadEmailLogs = useCallback(async () => {
    try {
      const data = await fetchAdminEmailLogs();
      setEmailLogs(data.logs);
      setSmtpConfigured(data.smtpConfigured);
    } catch {
      // handled cleanly
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadLeads();
      loadProjects();
      loadEmailLogs();
    }
  }, [authenticated, statusFilter, searchQuery]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await loginAdmin(loginEmail.trim(), loginPassword);
      setAuthenticated(res.authenticated);
      setAdminEmail(res.email);
      setLoginPassword('');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await logoutAdmin();
    setAuthenticated(false);
    setAdminEmail('');
    setLeads([]);
    setSelectedLead(null);
  }

  async function handleSaveLead() {
    if (!selectedLead) return;
    setSavingLead(true);
    setLeadNotice(null);
    try {
      const updated = await updateAdminLead(selectedLead.id, {
        lead_status: editStatus,
        notes: editNotes,
      });
      setSelectedLead(updated);
      setLeadNotice(`Updated ${updated.lead_id}`);
      await loadLeads();
    } catch (err) {
      setLeadNotice(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setSavingLead(false);
    }
  }

  async function handleResendEmail(leadId: string) {
    setResendingLeadId(leadId);
    setLeadNotice(null);
    try {
      const res = await resendLeadEmail(leadId);
      setLeadNotice(
        res.log.status === 'sent'
          ? `Dispatched ${res.log.lead_id} to info@clsfae.com`
          : `Logged ${res.log.lead_id} (${res.log.status})`
      );
      await loadLeads();
      await loadEmailLogs();
    } catch (err) {
      setLeadNotice(err instanceof Error ? err.message : 'Unable to resend email.');
    } finally {
      setResendingLeadId(null);
    }
  }

  function startEditProject(project: Project) {
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name,
      location: project.location,
      category: project.category,
      scope: project.scope,
      short_description: project.short_description,
      before_image: project.before_image,
      after_image: project.after_image,
      featured: project.featured,
    });
    setProjectNotice(null);
  }

  async function handleSaveProject(e: FormEvent) {
    e.preventDefault();
    setSavingProject(true);
    setProjectNotice(null);
    try {
      if (editingProjectId) {
        await updateAdminProject(editingProjectId, projectForm);
        setProjectNotice('Project updated.');
      } else {
        await createAdminProject(projectForm);
        setProjectNotice('Project added.');
      }
      setEditingProjectId(null);
      setProjectForm(EMPTY_PROJECT_FORM);
      await loadProjects();
    } catch (err) {
      setProjectNotice(err instanceof Error ? err.message : 'Unable to save project.');
    } finally {
      setSavingProject(false);
    }
  }

  async function handleDeleteProject(id: string) {
    await deleteAdminProject(id);
    if (editingProjectId === id) {
      setEditingProjectId(null);
      setProjectForm(EMPTY_PROJECT_FORM);
    }
    await loadProjects();
  }

  return (
    <>
      <Seo
        title="Administration | CLSF Building Contracting"
        description="Private administration dashboard for CLSF Building Contracting leads and projects."
        path="/admin"
      />

      <PageHero
        label="Internal Desk"
        title="CLSF Operations & Leads Dashboard"
        intro="Private management console for incoming quotation enquiries, site visit bookings, and portfolio entries."
        breadcrumbs={[{ label: 'Admin' }]}
      />

      <section className="bg-[hsl(var(--background))] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {authLoading ? (
            <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-12 text-sm text-[hsl(var(--muted-foreground))]">
              Verifying session...
            </div>
          ) : !authenticated ? (
            <form
              onSubmit={handleLogin}
              className="mx-auto max-w-md border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 lg:p-10"
            >
              <p className="section-label">Authentication Required</p>
              <h2 className="mt-2 text-2xl font-medium text-[hsl(var(--foreground))]">
                Administrator Sign In
              </h2>
              {loginError && (
                <div role="alert" className="mt-5 border border-[hsl(var(--accent))] bg-[hsl(var(--muted))] p-3 text-sm">
                  {loginError}
                </div>
              )}
              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="admin-email" className="block text-xs font-medium uppercase tracking-[0.18em]">
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="info@clsfae.com"
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className="block text-xs font-medium uppercase tracking-[0.18em]">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-2 min-h-[46px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loggingIn}
                  className="inline-flex min-h-[48px] w-full items-center justify-center bg-[hsl(var(--foreground))] text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))] hover:bg-[hsl(var(--accent))]"
                >
                  {loggingIn ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {/* Top control bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTab('leads')}
                    className={`min-h-[44px] border px-6 text-xs font-medium uppercase tracking-[0.18em] ${
                      tab === 'leads'
                        ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                        : 'border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]'
                    }`}
                  >
                    Leads ({counts.ALL || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('emails')}
                    className={`min-h-[44px] border px-6 text-xs font-medium uppercase tracking-[0.18em] ${
                      tab === 'emails'
                        ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                        : 'border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]'
                    }`}
                  >
                    Email Log ({emailLogs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('projects')}
                    className={`min-h-[44px] border px-6 text-xs font-medium uppercase tracking-[0.18em] ${
                      tab === 'projects'
                        ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                        : 'border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]'
                    }`}
                  >
                    Projects ({projects.length})
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{adminEmail}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex min-h-[40px] items-center gap-2 border border-[hsl(var(--border))] px-4 text-xs uppercase tracking-[0.16em] hover:border-[hsl(var(--foreground))]"
                  >
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {tab === 'leads' ? (
                <div className="mt-8 space-y-6">
                  {/* Status counts & Search */}
                  <div className="flex flex-wrap gap-2">
                    {(['ALL', ...LEAD_STATUSES] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`tabular-nums min-h-[40px] border px-3.5 text-[11px] font-medium uppercase tracking-[0.14em] ${
                          statusFilter === status
                            ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                            : 'border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]'
                        }`}
                      >
                        {status.replace(/_/g, ' ')} ({counts[status] || 0})
                      </button>
                    ))}
                  </div>

                  <div className="relative max-w-md">
                    <Search className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by CLSF ref, name, phone, area, or service..."
                      className="min-h-[44px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] pr-4 pl-10 text-sm focus:border-[hsl(var(--foreground))] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Lead list */}
                    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] lg:col-span-5">
                      {leads.length === 0 ? (
                        <div className="p-8 text-sm text-[hsl(var(--muted-foreground))]">
                          No enquiries match the current filter.
                        </div>
                      ) : (
                        <div className="divide-y divide-[hsl(var(--border))] max-h-[680px] overflow-y-auto">
                          {leads.map((lead) => {
                            const active = selectedLead?.id === lead.id;
                            return (
                              <button
                                key={lead.id}
                                type="button"
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setEditStatus(lead.lead_status);
                                  setEditNotes(lead.notes);
                                  setLeadNotice(null);
                                }}
                                className={`w-full p-5 text-left transition-colors ${
                                  active
                                    ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                                    : 'hover:bg-[hsl(var(--muted))]'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.16em]">
                                  <span className="tabular-nums font-medium text-[hsl(var(--accent))]">
                                    {lead.lead_id}
                                  </span>
                                  <span>{lead.lead_status.replace(/_/g, ' ')}</span>
                                </div>
                                <p className="mt-2 text-base font-medium">{lead.name}</p>
                                <p
                                  className={`mt-1 text-xs ${
                                    active ? 'text-[hsl(0_0%_74%)]' : 'text-[hsl(var(--muted-foreground))]'
                                  }`}
                                >
                                  {lead.enquiry_type.replace('_', ' ')} · {lead.property_type || 'Property'} ·{' '}
                                  {lead.location_area || lead.location_city}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Lead detail panel */}
                    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 lg:col-span-7 lg:p-8">
                      {!selectedLead ? (
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          Select an enquiry from the list to inspect full submission details and update status.
                        </p>
                      ) : (
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[hsl(var(--border))] pb-6">
                            <div>
                              <p className="tabular-nums section-label">{selectedLead.lead_id}</p>
                              <h3 className="mt-2 text-2xl font-medium text-[hsl(var(--foreground))]">
                                {selectedLead.name}
                              </h3>
                              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
                                {selectedLead.enquiry_type.replace('_', ' ')} · Submitted{' '}
                                {new Date(selectedLead.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <dl className="divide-y divide-[hsl(var(--border))] text-sm">
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Phone</dt>
                              <dd className="col-span-2 tabular-nums">{selectedLead.phone}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Email</dt>
                              <dd className="col-span-2">{selectedLead.email || '—'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Company</dt>
                              <dd className="col-span-2">{selectedLead.company || '—'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Property Type</dt>
                              <dd className="col-span-2">{selectedLead.property_type || '—'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Services</dt>
                              <dd className="col-span-2">
                                {selectedLead.services.length > 0 ? selectedLead.services.join(', ') : '—'}
                              </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Location</dt>
                              <dd className="col-span-2">
                                {[selectedLead.location_area, selectedLead.location_city, selectedLead.location_address]
                                  .filter(Boolean)
                                  .join(', ') || '—'}
                              </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Status / Visit</dt>
                              <dd className="col-span-2">
                                {selectedLead.project_status ||
                                  (selectedLead.preferred_visit_date
                                    ? `${selectedLead.preferred_visit_date} ${selectedLead.preferred_visit_time}`
                                    : '—')}
                              </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Project Size</dt>
                              <dd className="col-span-2">
                                {[
                                  selectedLead.project_size_area ? `${selectedLead.project_size_area} sq ft` : null,
                                  selectedLead.project_size_floors ? `${selectedLead.project_size_floors} floors` : null,
                                  selectedLead.project_size_estimate || null,
                                  selectedLead.preferred_start_date ? `Start: ${selectedLead.preferred_start_date}` : null,
                                ]
                                  .filter(Boolean)
                                  .join(' · ') || '—'}
                              </dd>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Requirements</dt>
                              <dd className="col-span-2 whitespace-pre-line">{selectedLead.description || '—'}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-3">
                              <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Attachments</dt>
                              <dd className="col-span-2 space-y-1">
                                {selectedLead.attachments.length === 0
                                  ? 'None'
                                  : selectedLead.attachments.map((file) => (
                                      <div key={file.filename}>
                                        <a
                                          href={file.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="underline hover:text-[hsl(var(--accent))]"
                                        >
                                          {file.originalName}
                                        </a>
                                      </div>
                                    ))}
                              </dd>
                            </div>
                          </dl>

                          <div className="mt-6 space-y-4 border-t border-[hsl(var(--border))] pt-6">
                            <div>
                              <label htmlFor="admin-lead-status" className="block text-xs font-medium uppercase tracking-[0.18em]">
                                Pipeline Status
                              </label>
                              <select
                                id="admin-lead-status"
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                                className="mt-2 min-h-[44px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm"
                              >
                                {LEAD_STATUSES.map((st) => (
                                  <option key={st} value={st}>
                                    {st.replace(/_/g, ' ')}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label htmlFor="admin-lead-notes" className="block text-xs font-medium uppercase tracking-[0.18em]">
                                Internal Notes
                              </label>
                              <textarea
                                id="admin-lead-notes"
                                rows={3}
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                className="mt-2 w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 text-sm"
                              />
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              <button
                                type="button"
                                disabled={savingLead}
                                onClick={handleSaveLead}
                                className="inline-flex min-h-[44px] items-center justify-center bg-[hsl(var(--accent))] px-6 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(40_6%_98%)]"
                              >
                                {savingLead ? 'Saving...' : 'Save Lead Update'}
                              </button>
                              <button
                                type="button"
                                disabled={resendingLeadId === selectedLead.lead_id}
                                onClick={() => void handleResendEmail(selectedLead.lead_id)}
                                className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[hsl(var(--foreground))] px-5 text-xs font-medium uppercase tracking-[0.16em] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]"
                              >
                                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>
                                  {resendingLeadId === selectedLead.lead_id
                                    ? 'Dispatching...'
                                    : 'Dispatch to info@clsfae.com'}
                                </span>
                              </button>
                              {leadNotice && (
                                <span className="text-xs text-[hsl(var(--muted-foreground))]">{leadNotice}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : tab === 'emails' ? (
                <div className="mt-8 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6">
                    <div>
                      <p className="section-label">Portal Email Routing · info@clsfae.com</p>
                      <p className="mt-2 text-sm text-[hsl(var(--foreground))]">
                        {smtpConfigured
                          ? 'SMTP mail transport is active. Portal enquiries dispatch immediately to info@clsfae.com.'
                          : 'SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) are not configured in environment secrets. Enquiries are queued in the portal log below.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void loadEmailLogs()}
                      className="inline-flex min-h-[40px] items-center gap-2 border border-[hsl(var(--border))] px-4 text-xs uppercase tracking-[0.16em] hover:border-[hsl(var(--foreground))]"
                    >
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Refresh Log</span>
                    </button>
                  </div>

                  {emailLogs.length === 0 ? (
                    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 text-sm text-[hsl(var(--muted-foreground))]">
                      No enquiry emails have been logged yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-[hsl(var(--border))] border border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
                      {emailLogs.map((log) => (
                        <div key={log.id} className="p-6">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="tabular-nums text-xs uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
                                {log.lead_id} · To: {log.to} · Status: {log.status.replace(/_/g, ' ')}
                              </p>
                              <h3 className="mt-1 text-base font-medium text-[hsl(var(--foreground))]">
                                {log.subject}
                              </h3>
                              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                                {new Date(log.dispatched_at).toLocaleString()} · Mode: {log.mode}
                                {log.error ? ` · Error: ${log.error}` : ''}
                              </p>
                            </div>
                            <button
                              type="button"
                              disabled={resendingLeadId === log.lead_id}
                              onClick={() => void handleResendEmail(log.lead_id)}
                              className="inline-flex min-h-[38px] items-center gap-2 border border-[hsl(var(--border))] px-4 text-xs uppercase tracking-[0.14em] hover:border-[hsl(var(--foreground))]"
                            >
                              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{resendingLeadId === log.lead_id ? 'Sending...' : 'Resend'}</span>
                            </button>
                          </div>
                          {log.bodyText && (
                            <pre className="mt-4 max-h-48 overflow-y-auto border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-[hsl(var(--foreground))]">
                              {log.bodyText}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                  {/* Project editor form */}
                  <form
                    onSubmit={handleSaveProject}
                    className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 lg:col-span-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="section-label">
                        {editingProjectId ? 'Edit Project' : 'Add Project'}
                      </p>
                      {editingProjectId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(null);
                            setProjectForm(EMPTY_PROJECT_FORM);
                          }}
                          className="text-xs underline"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    {projectNotice && (
                      <div className="mt-4 border border-[hsl(var(--accent))] bg-[hsl(var(--muted))] p-3 text-xs">
                        {projectNotice}
                      </div>
                    )}

                    <div className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="proj-name" className="block text-xs font-medium uppercase tracking-[0.16em]">
                          Project Title *
                        </label>
                        <input
                          id="proj-name"
                          type="text"
                          required
                          value={projectForm.name}
                          onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                          className="mt-1.5 min-h-[42px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="proj-location" className="block text-xs font-medium uppercase tracking-[0.16em]">
                          Location *
                        </label>
                        <input
                          id="proj-location"
                          type="text"
                          required
                          value={projectForm.location}
                          onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                          className="mt-1.5 min-h-[42px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="proj-cat" className="block text-xs font-medium uppercase tracking-[0.16em]">
                          Category
                        </label>
                        <select
                          id="proj-cat"
                          value={projectForm.category}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, category: e.target.value as ProjectCategory })
                          }
                          className="mt-1.5 min-h-[42px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-sm"
                        >
                          {PROJECT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="proj-scope" className="block text-xs font-medium uppercase tracking-[0.16em]">
                          Scope Line *
                        </label>
                        <input
                          id="proj-scope"
                          type="text"
                          required
                          value={projectForm.scope}
                          onChange={(e) => setProjectForm({ ...projectForm, scope: e.target.value })}
                          className="mt-1.5 min-h-[42px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="proj-desc" className="block text-xs font-medium uppercase tracking-[0.16em]">
                          Delivered Detail *
                        </label>
                        <textarea
                          id="proj-desc"
                          rows={3}
                          required
                          value={projectForm.short_description}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, short_description: e.target.value })
                          }
                          className="mt-1.5 w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="proj-img" className="block text-xs font-medium uppercase tracking-[0.16em]">
                          Project Image
                        </label>
                        <select
                          id="proj-img"
                          value={projectForm.after_image}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              before_image: e.target.value,
                              after_image: e.target.value,
                            })
                          }
                          className="mt-1.5 min-h-[42px] w-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 text-sm"
                        >
                          {IMAGE_PRESETS.map((preset) => (
                            <option key={preset.url} value={preset.url}>
                              {preset.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        />
                        <span>Featured on homepage</span>
                      </label>
                      <button
                        type="submit"
                        disabled={savingProject}
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-[hsl(var(--foreground))] text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--background))] hover:bg-[hsl(var(--accent))]"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        <span>{editingProjectId ? 'Update Project' : 'Add Project'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Project list */}
                  <div className="divide-y divide-[hsl(var(--border))] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] lg:col-span-7">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-start justify-between gap-4 p-5">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--accent))]">
                            {project.category} · {project.location}
                            {project.featured ? ' · Featured' : ''}
                          </p>
                          <h4 className="mt-1 text-base font-medium text-[hsl(var(--foreground))]">
                            {project.name}
                          </h4>
                          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{project.scope}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditProject(project)}
                            className="min-h-[36px] border border-[hsl(var(--border))] px-3 text-xs uppercase tracking-[0.14em] hover:border-[hsl(var(--foreground))]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${project.name}`}
                            onClick={() => handleDeleteProject(project.id)}
                            className="flex h-9 w-9 items-center justify-center border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
