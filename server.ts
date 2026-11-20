import express, { type Request, type Response, type NextFunction } from 'express';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PROJECTS } from './src/data/projects.ts';
import { SERVICE_CATEGORIES } from './src/data/services.ts';
import {
  attachLiveVoiceWebSocket,
  isAllowedChatModel,
  mapGeminiError,
  runMultiTurnChat,
  runSearchGroundedLookup,
  type ChatTurnInput,
} from './server/gemini.ts';
import {
  COMPANY_NOTIFICATION_EMAIL,
  dispatchLeadEmail,
  isSmtpConfigured,
} from './server/mailer.ts';
import type { EmailLogRecord, Lead, LeadStatus, Project, ServiceRecord, Testimonial } from './src/types/index.ts';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@clsfae.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CLSF-Admin-2026';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'clsf-building-contracting-dubai-session-key';
const COOKIE_NAME = 'clsf_admin_session';

interface StoreData {
  nextLeadNumber: number;
  leads: Lead[];
  projects: Project[];
  services: ServiceRecord[];
  testimonials: Testimonial[];
  emailLogs: EmailLogRecord[];
}

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function buildInitialStore(): StoreData {
  const services: ServiceRecord[] = SERVICE_CATEGORIES.map((cat, idx) => ({
    title: cat.title,
    slug: cat.slug,
    number: cat.number,
    tagline: cat.tagline,
    description: cat.description,
    features: cat.children.map((c) => c.title),
    image: cat.image,
    order: idx + 1,
  }));

  return {
    nextLeadNumber: 1001,
    leads: [],
    projects: INITIAL_PROJECTS,
    services,
    testimonials: [],
    emailLogs: [],
  };
}

function readStore(): StoreData {
  ensureDirectories();
  if (!fs.existsSync(STORE_PATH)) {
    const initial = buildInitialStore();
    writeStore(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as StoreData;
    return {
      nextLeadNumber: parsed.nextLeadNumber || 1001,
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : INITIAL_PROJECTS,
      services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : buildInitialStore().services,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [],
      emailLogs: Array.isArray(parsed.emailLogs) ? parsed.emailLogs : [],
    };
  } catch {
    const initial = buildInitialStore();
    writeStore(initial);
    return initial;
  }
}

function writeStore(data: StoreData) {
  ensureDirectories();
  const tmpPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpPath, STORE_PATH);
}

function parseCookies(cookieHeader?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    result[key] = val;
  }
  return result;
}

function signToken(email: string): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyToken(token?: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false };
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };
  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return { valid: false };
  }
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email: string;
      exp: number;
    };
    if (decoded.exp < Date.now()) return { valid: false };
    return { valid: true, email: decoded.email };
  } catch {
    return { valid: false };
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const cookies = parseCookies(req.headers.cookie);
  const authHeader = req.headers.authorization;
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const verification = verifyToken(cookies[COOKIE_NAME] || bearer);
  if (!verification.valid) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  next();
}

const VALID_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'SITE_VISIT_REQUIRED',
  'QUOTATION_IN_PROGRESS',
  'QUOTATION_SENT',
  'FOLLOW_UP',
  'WON',
  'LOST',
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDirectories();
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname).replace(/[^a-zA-Z0-9.]/g, '');
    const unique = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${safeExt}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 10 },
});

async function startServer() {
  ensureDirectories();
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Public access to uploaded attachments so anyone with the link can open them
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Auth routes
  app.post('/api/auth/login', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Invalid administrator credentials.' });
      return;
    }

    const token = signToken(ADMIN_EMAIL);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({ authenticated: true, email: ADMIN_EMAIL });
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.json({ authenticated: false });
  });

  app.get('/api/auth/me', (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const verification = verifyToken(cookies[COOKIE_NAME]);
    if (!verification.valid) {
      res.json({ authenticated: false });
      return;
    }
    res.json({ authenticated: true, email: verification.email });
  });

  // Public file uploads
  app.post('/api/uploads', upload.array('files', 10), (req, res) => {
    const files = (req.files as Express.Multer.File[]) || [];
    const baseUrl = process.env.APP_URL || '';
    const mapped = files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      url: baseUrl ? `${baseUrl.replace(/\/$/, '')}/uploads/${f.filename}` : `/uploads/${f.filename}`,
      size: f.size,
      mimeType: f.mimetype,
    }));
    res.status(201).json({ files: mapped });
  });

  // Public Lead creation — persists lead and dispatches notification to info@clsfae.com
  app.post('/api/leads', async (req, res) => {
    try {
      const body = req.body || {};
      const name = String(body.name || '').trim();
      const phone = String(body.phone || '').trim();
      const enquiryType = body.enquiry_type || 'quote';

      if (!name || !phone) {
        res.status(400).json({ error: 'Name and phone number are required.' });
        return;
      }

      const store = readStore();
      const refNumber = `CLSF-${store.nextLeadNumber}`;
      store.nextLeadNumber += 1;

      const now = new Date().toISOString();
      const lead: Lead = {
        id: crypto.randomUUID(),
        lead_id: refNumber,
        enquiry_type: ['quote', 'site_visit', 'amc', 'contact'].includes(enquiryType) ? enquiryType : 'quote',
        name,
        company: String(body.company || '').trim(),
        phone,
        email: String(body.email || '').trim(),
        services: Array.isArray(body.services) ? body.services.map(String) : [],
        property_type: String(body.property_type || '').trim(),
        location_area: String(body.location_area || '').trim(),
        location_city: String(body.location_city || 'Dubai').trim(),
        location_address: String(body.location_address || '').trim(),
        project_status: String(body.project_status || '').trim(),
        description: String(body.description || '').trim(),
        project_size_area: String(body.project_size_area || '').trim(),
        project_size_floors: String(body.project_size_floors || '').trim(),
        project_size_estimate: String(body.project_size_estimate || '').trim(),
        preferred_start_date: String(body.preferred_start_date || '').trim(),
        attachments: Array.isArray(body.attachments) ? body.attachments : [],
        preferred_visit_date: String(body.preferred_visit_date || '').trim(),
        preferred_visit_time: String(body.preferred_visit_time || '').trim(),
        lead_status: 'NEW',
        notes: '',
        created_at: now,
        updated_at: now,
      };

      const originUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const dispatchResult = await dispatchLeadEmail(lead, originUrl);
      lead.email_status = dispatchResult.status;

      store.leads.unshift(lead);
      store.emailLogs.unshift({
        id: crypto.randomUUID(),
        to: dispatchResult.to,
        subject: dispatchResult.subject,
        lead_id: lead.lead_id,
        dispatched_at: now,
        mode: dispatchResult.mode,
        status: dispatchResult.status,
        messageId: dispatchResult.messageId,
        error: dispatchResult.error,
        bodyText: dispatchResult.bodyText,
      });

      writeStore(store);
      res.status(201).json({
        lead,
        emailDispatch: {
          to: dispatchResult.to,
          status: dispatchResult.status,
          mode: dispatchResult.mode,
        },
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Unable to submit enquiry.',
      });
    }
  });

  // Admin Email Dispatch Logs & Resend
  app.get('/api/email-logs', requireAdmin, (_req, res) => {
    const store = readStore();
    res.json({
      logs: store.emailLogs,
      smtpConfigured: isSmtpConfigured(),
      notificationEmail: COMPANY_NOTIFICATION_EMAIL,
    });
  });

  app.post('/api/email-logs/:leadId/resend', requireAdmin, async (req, res) => {
    try {
      const store = readStore();
      const lead = store.leads.find((l) => l.lead_id === req.params.leadId || l.id === req.params.leadId);
      if (!lead) {
        res.status(404).json({ error: 'Lead not found.' });
        return;
      }

      const originUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const dispatchResult = await dispatchLeadEmail(lead, originUrl);
      const now = new Date().toISOString();
      lead.email_status = dispatchResult.status;
      lead.updated_at = now;

      const log: EmailLogRecord = {
        id: crypto.randomUUID(),
        to: dispatchResult.to,
        subject: dispatchResult.subject,
        lead_id: lead.lead_id,
        dispatched_at: now,
        mode: dispatchResult.mode,
        status: dispatchResult.status,
        messageId: dispatchResult.messageId,
        error: dispatchResult.error,
        bodyText: dispatchResult.bodyText,
      };
      store.emailLogs.unshift(log);
      writeStore(store);

      res.json({ log, lead });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Unable to dispatch email.',
      });
    }
  });

  // Admin Lead endpoints
  app.get('/api/leads', requireAdmin, (req, res) => {
    const store = readStore();
    const statusFilter = String(req.query.status || '').trim();
    const q = String(req.query.q || '').trim().toLowerCase();

    const counts: Record<string, number> = { ALL: store.leads.length };
    for (const st of VALID_STATUSES) {
      counts[st] = 0;
    }
    for (const lead of store.leads) {
      counts[lead.lead_status] = (counts[lead.lead_status] || 0) + 1;
    }

    let filtered = store.leads;
    if (statusFilter && statusFilter !== 'ALL') {
      filtered = filtered.filter((l) => l.lead_status === statusFilter);
    }
    if (q) {
      filtered = filtered.filter(
        (l) =>
          l.lead_id.toLowerCase().includes(q) ||
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.location_area.toLowerCase().includes(q) ||
          l.services.some((s) => s.toLowerCase().includes(q))
      );
    }

    res.json({ leads: filtered, counts });
  });

  app.patch('/api/leads/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const idx = store.leads.findIndex((l) => l.id === req.params.id || l.lead_id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Lead not found.' });
      return;
    }

    const current = store.leads[idx];
    const nextStatus = req.body?.lead_status;
    if (nextStatus && !VALID_STATUSES.includes(nextStatus)) {
      res.status(400).json({ error: 'Invalid lead status.' });
      return;
    }

    const updated: Lead = {
      ...current,
      lead_status: nextStatus || current.lead_status,
      notes: typeof req.body?.notes === 'string' ? req.body.notes : current.notes,
      updated_at: new Date().toISOString(),
    };
    store.leads[idx] = updated;
    writeStore(store);
    res.json({ lead: updated });
  });

  // Public Projects read
  app.get('/api/projects', (_req, res) => {
    const store = readStore();
    const sorted = [...store.projects].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (a.order || 999) - (b.order || 999);
    });
    res.json({ projects: sorted });
  });

  // Admin Projects CRUD
  app.post('/api/projects', requireAdmin, (req, res) => {
    const body = req.body || {};
    const name = String(body.name || '').trim();
    const location = String(body.location || '').trim();
    const scope = String(body.scope || '').trim();
    const short_description = String(body.short_description || '').trim();
    if (!name || !location || !scope || !short_description) {
      res.status(400).json({ error: 'Name, location, scope, and description are required.' });
      return;
    }

    const store = readStore();
    const project: Project = {
      id: `proj-${crypto.randomBytes(4).toString('hex')}`,
      name,
      location,
      category: body.category || 'Other',
      scope,
      short_description,
      before_image: String(body.before_image || '/src/assets/images/hero_villa_construction_1795167605296.jpg'),
      after_image: String(body.after_image || '/src/assets/images/hero_villa_construction_1795167605296.jpg'),
      featured: Boolean(body.featured),
      order: store.projects.length + 1,
    };
    store.projects.push(project);
    writeStore(store);
    res.status(201).json({ project });
  });

  app.patch('/api/projects/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const idx = store.projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    const existing = store.projects[idx];
    const updated: Project = {
      ...existing,
      name: typeof req.body?.name === 'string' ? req.body.name.trim() : existing.name,
      location: typeof req.body?.location === 'string' ? req.body.location.trim() : existing.location,
      category: req.body?.category || existing.category,
      scope: typeof req.body?.scope === 'string' ? req.body.scope.trim() : existing.scope,
      short_description:
        typeof req.body?.short_description === 'string'
          ? req.body.short_description.trim()
          : existing.short_description,
      before_image: typeof req.body?.before_image === 'string' ? req.body.before_image : existing.before_image,
      after_image: typeof req.body?.after_image === 'string' ? req.body.after_image : existing.after_image,
      featured: typeof req.body?.featured === 'boolean' ? req.body.featured : existing.featured,
    };
    store.projects[idx] = updated;
    writeStore(store);
    res.json({ project: updated });
  });

  app.delete('/api/projects/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const next = store.projects.filter((p) => p.id !== req.params.id);
    if (next.length === store.projects.length) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    store.projects = next;
    writeStore(store);
    res.json({ deleted: true });
  });

  // Public Services & Testimonials
  app.get('/api/services', (_req, res) => {
    const store = readStore();
    res.json({ services: store.services });
  });

  app.get('/api/testimonials', (_req, res) => {
    const store = readStore();
    res.json({ testimonials: store.testimonials.filter((t) => t.approved) });
  });

  // Google Maps client configuration
  app.get('/api/maps/config', (_req, res) => {
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
    res.json({ apiKey });
  });

  // Gemini Multi-Turn Chat & Search Grounding
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const body = req.body || {};
      const rawModel = String(body.model || 'gemini-4-hydrogen');
      const model = isAllowedChatModel(rawModel) ? rawModel : 'gemini-4-hydrogen';
      const useSearch = body.useSearch !== false;
      const messages = Array.isArray(body.messages) ? (body.messages as ChatTurnInput[]) : [];

      const result = await runMultiTurnChat({ messages, model, useSearch });
      res.json(result);
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  app.post('/api/gemini/search', async (req, res) => {
    try {
      const query = String(req.body?.query || '').trim();
      if (!query) {
        res.status(400).json({ error: 'Search query is required.' });
        return;
      }
      const result = await runSearchGroundedLookup(query);
      res.json(result);
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const server = http.createServer(app);
  attachLiveVoiceWebSocket(server);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`CLSF Building Contracting server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
