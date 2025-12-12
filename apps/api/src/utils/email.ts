import { join } from 'node:path';

import nodemailer from 'nodemailer';
import { nodemailerMjmlPlugin } from 'nodemailer-mjml';

import { SUPPORT_EMAIL } from '../constants';
import env from './env';

interface EmailProps {
  subject?: string;
  from: string;
  templateName: TemplateName;
  templateData?: Record<string, unknown>;
  language?: 'fr' | 'en' | null;
}

export type EmailLanguages = 'fr' | 'en' | null;

const TEMPLATES_NAME = {
  supportRequest: 'supportRequest',
};

type TemplateName = keyof typeof TEMPLATES_NAME;

const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

mailer.use('compile', nodemailerMjmlPlugin({ templateFolder: join(__dirname, '../email-templates') }));

export const emailService = {
  sendSupportEmail: async ({
    from,
    templateName,
    templateData,
    language = null,
    subject = 'New Support request',
  }: EmailProps) => {
    const translatedTemplate = language ? `${templateName}-${language}` : templateName;
    return await mailer.sendMail({
      from: `"Support Boat share" <${SUPPORT_EMAIL}>`,
      to: SUPPORT_EMAIL,
      replyTo: from,
      subject,
      templateName: translatedTemplate,
      templateData,
    });
  },
};

export type EmailService = typeof emailService;
