import nodemailer from 'nodemailer';
import type { Lead } from '../src/types/index.ts';

export const COMPANY_NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@clsfae.com';

export interface EmailDispatchResult {
  to: string;
  subject: string;
  mode: 'smtp' | 'recorded';
  status: 'sent' | 'pending_smtp' | 'failed';
  messageId?: string;
  error?: string;
  bodyText: string;
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ||
      (process.env.SMTP_USER && process.env.SMTP_PASS)
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatLeadEmailContent(lead: Lead, originUrl?: string) {
  const enquiryLabel = lead.enquiry_type.replace('_', ' ').toUpperCase();
  const subject = `[CLSF Portal] New ${enquiryLabel} (${lead.lead_id}) — ${lead.name}`;
  const baseUrl = (originUrl || process.env.APP_URL || '').replace(/\/$/, '');

  const attachmentLinks = lead.attachments.map((a) => {
    const url = a.url.startsWith('http') ? a.url : `${baseUrl}${a.url.startsWith('/') ? a.url : `/${a.url}`}`;
    return { name: a.originalName, url };
  });

  const textLines = [
    `CLSF BUILDING CONTRACTING — NEW PORTAL ENQUIRY`,
    `================================================`,
    `Reference: ${lead.lead_id}`,
    `Enquiry Type: ${enquiryLabel}`,
    `Submitted At: ${lead.created_at}`,
    ``,
    `CLIENT DETAILS`,
    `Name: ${lead.name}`,
    lead.company ? `Company: ${lead.company}` : null,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    ``,
    `PROJECT DETAILS`,
    lead.property_type ? `Property Type: ${lead.property_type}` : null,
    lead.services.length > 0 ? `Services: ${lead.services.join(', ')}` : null,
    `Location: ${[lead.location_area, lead.location_city, lead.location_address].filter(Boolean).join(', ') || 'Dubai'}`,
    lead.project_status ? `Project Status: ${lead.project_status}` : null,
    lead.preferred_visit_date
      ? `Preferred Visit: ${lead.preferred_visit_date}${lead.preferred_visit_time ? ` (${lead.preferred_visit_time})` : ''}`
      : null,
    lead.project_size_area ? `Approximate Area: ${lead.project_size_area} sq ft` : null,
    lead.project_size_floors ? `Floors: ${lead.project_size_floors}` : null,
    lead.project_size_estimate ? `Estimated Scope: ${lead.project_size_estimate}` : null,
    lead.preferred_start_date ? `Expected Start Date: ${lead.preferred_start_date}` : null,
    ``,
    `REQUIREMENTS`,
    lead.description || 'Not provided',
    ``,
    attachmentLinks.length > 0 ? `ATTACHMENTS` : null,
    ...attachmentLinks.map((a) => `- ${a.name}: ${a.url}`),
  ].filter((line): line is string => line !== null);

  const bodyText = textLines.join('\n');

  const detailRows: [string, string][] = [
    ['Reference', lead.lead_id],
    ['Enquiry Type', enquiryLabel],
    ['Client Name', lead.name],
    ...(lead.company ? [['Company', lead.company] as [string, string]] : []),
    ['Telephone', lead.phone],
    ...(lead.email ? [['Client Email', lead.email] as [string, string]] : []),
    ...(lead.property_type ? [['Property Type', lead.property_type] as [string, string]] : []),
    ...(lead.services.length > 0 ? [['Services', lead.services.join(', ')] as [string, string]] : []),
    ['Location', [lead.location_area, lead.location_city, lead.location_address].filter(Boolean).join(', ') || 'Dubai'],
    ...(lead.project_status ? [['Project Status', lead.project_status] as [string, string]] : []),
    ...(lead.preferred_visit_date
      ? [['Preferred Visit', `${lead.preferred_visit_date}${lead.preferred_visit_time ? ` · ${lead.preferred_visit_time}` : ''}`] as [string, string]]
      : []),
    ...(lead.project_size_area ? [['Area (sq ft)', lead.project_size_area] as [string, string]] : []),
    ...(lead.project_size_floors ? [['Floors', lead.project_size_floors] as [string, string]] : []),
    ...(lead.project_size_estimate ? [['Scope Estimate', lead.project_size_estimate] as [string, string]] : []),
    ...(lead.preferred_start_date ? [['Expected Start', lead.preferred_start_date] as [string, string]] : []),
  ];

  const htmlRows = detailRows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #d1d1d1;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#616161;width:180px;">${escapeHtml(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #d1d1d1;font-size:14px;color:#1f1f1f;">${escapeHtml(v)}</td></tr>`
    )
    .join('');

  const htmlAttachments =
    attachmentLinks.length > 0
      ? `<div style="margin-top:20px;"><p style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#99774d;margin:0 0 8px;">Attachments</p><ul style="margin:0;padding-left:18px;">${attachmentLinks
          .map(
            (a) =>
              `<li style="margin-bottom:4px;"><a href="${escapeHtml(a.url)}" style="color:#1f1f1f;">${escapeHtml(a.name)}</a></li>`
          )
          .join('')}</ul></div>`
      : '';

  const bodyHtml = `
  <div style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f2f0ec;padding:24px;color:#1f1f1f;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d1d1d1;">
      <div style="background:#1f1f1f;color:#f2f0ec;padding:20px 24px;border-bottom:3px solid #99774d;">
        <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#99774d;">CLSF Building Contracting · Portal Notification</p>
        <h1 style="margin:6px 0 0;font-size:20px;font-weight:500;">${escapeHtml(lead.lead_id)} — ${escapeHtml(lead.name)}</h1>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">${htmlRows}</table>
        <div style="margin-top:20px;padding:16px;background:#f7f6f3;border:1px solid #d1d1d1;">
          <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#99774d;">Requirement Brief</p>
          <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-line;">${escapeHtml(lead.description || 'Not provided')}</p>
        </div>
        ${htmlAttachments}
      </div>
      <div style="padding:14px 24px;background:#f7f6f3;border-top:1px solid #d1d1d1;font-size:12px;color:#616161;">
        Sent from CLSF Building Contracting Portal to ${escapeHtml(COMPANY_NOTIFICATION_EMAIL)}
      </div>
    </div>
  </div>`;

  return { subject, bodyText, bodyHtml };
}

export async function dispatchLeadEmail(lead: Lead, originUrl?: string): Promise<EmailDispatchResult> {
  const { subject, bodyText, bodyHtml } = formatLeadEmailContent(lead, originUrl);
  const to = COMPANY_NOTIFICATION_EMAIL;

  if (!isSmtpConfigured()) {
    return {
      to,
      subject,
      mode: 'recorded',
      status: 'pending_smtp',
      bodyText,
    };
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || COMPANY_NOTIFICATION_EMAIL;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      connectionTimeout: 4000,
      greetingTimeout: 4000,
      socketTimeout: 5000,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"CLSF Contracting Portal" <${fromAddress}>`,
      to,
      replyTo: lead.email || undefined,
      subject,
      text: bodyText,
      html: bodyHtml,
    });

    return {
      to,
      subject,
      mode: 'smtp',
      status: 'sent',
      messageId: info.messageId,
      bodyText,
    };
  } catch (err) {
    return {
      to,
      subject,
      mode: 'smtp',
      status: 'failed',
      error: err instanceof Error ? err.message : 'SMTP delivery failed.',
      bodyText,
    };
  }
}
