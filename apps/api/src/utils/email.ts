import { existsSync } from 'node:fs';
import { join } from 'node:path';

import nodemailer from 'nodemailer';
import { nodemailerMjmlPlugin } from 'nodemailer-mjml';
import { Resend } from 'resend';

import { APP_NAME, SUPPORT_EMAIL } from '../constants';
import env from './env';

export type EmailLanguages = 'fr' | 'en';

interface EmailProps {
  subject?: string;
  from: string;
  templateName: TemplateName;
  templateData?: Record<string, unknown>;
  language: EmailLanguages;
}

interface ResendEmailProps {
  subject?: string;
  from: string;
  message: string;
}

const TEMPLATES_NAME = {
  supportRequest: 'supportRequest',
};

type TemplateName = keyof typeof TEMPLATES_NAME;

const templateFolder = join(__dirname, '../email-templates');

const resolveTemplateName = (baseName: string, language: EmailLanguages) => {
  const localized = `${baseName}-${language}`;
  const fallback = `${baseName}-en`;

  const localizedPath = join(templateFolder, `${localized}.mjml`);
  if (existsSync(localizedPath)) return localized;

  const fallbackPath = join(templateFolder, `${fallback}.mjml`);
  if (existsSync(fallbackPath)) return fallback;

  return baseName;
};

const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

const resend = new Resend(env.RESEND_API_KEY);

mailer.use('compile', nodemailerMjmlPlugin({ templateFolder }));

export const emailService = {
  sendSupportEmail: async ({
    from,
    templateName,
    templateData,
    language = 'en',
    subject = 'New Support request',
  }: EmailProps) => {
    try {
      const translatedTemplate = resolveTemplateName(templateName, language);
      return await mailer.sendMail({
        from: `"Support ${APP_NAME}" <${SUPPORT_EMAIL}>`,
        to: SUPPORT_EMAIL,
        replyTo: from,
        subject,
        templateName: translatedTemplate,
        templateData,
      });
    } catch (error) {
      console.error(`Email send error: ${error}`);
    }
  },
  sendResendEmail: async ({ from, message, subject = 'New Support request' }: ResendEmailProps) => {
    const { data, error } = await resend.emails.send({
      from: `"Support ${APP_NAME}" <${SUPPORT_EMAIL}>`,
      to: SUPPORT_EMAIL,
      replyTo: from,
      subject,
      html: message,
      text: message,
    });

    if (error) return error;

    return data;
  },
};

export type EmailService = typeof emailService;
