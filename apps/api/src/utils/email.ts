import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import handlebars from 'handlebars';
import mjml2html from 'mjml';
import { Resend } from 'resend';

import { APP_NAME, SUPPORT_EMAIL } from '../constants';
import env from './env';

type TemplateEmailVariables = Record<string, string | number>;
type SupportedEmailLanguages = 'en' | 'fr';

type BaseEmailOptions = {
  from: string;
  subject?: string;
};

type MessageEmail = {
  message: string;
  templateName?: never;
  templateVariables?: never;
};

type TemplateEmail = {
  templateName: TemplateName;
  templateVariables?: TemplateEmailVariables;
  message?: never;
};
type SendEmailOptions = BaseEmailOptions & (MessageEmail | TemplateEmail);

export const TEMPLATES_NAME = {
  supportRequest: 'supportRequest',
};

type TemplateName = keyof typeof TEMPLATES_NAME;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const renderMjmlTemplate = (
  templateName: TemplateName,
  language: SupportedEmailLanguages,
  variables: TemplateEmailVariables
): string => {
  const templatePath = join(__dirname, '../email-templates', `${templateName}-${language}.mjml`);
  const mjmlTemplate = readFileSync(templatePath, 'utf-8');

  const handlebarsTemplate = handlebars.compile(mjmlTemplate);
  const compiledMjml = handlebarsTemplate(variables);

  const { html, errors } = mjml2html(compiledMjml);

  if (errors?.length) {
    console.error('MJML rendering errors:', errors);
  }

  return html;
};

const resend = new Resend(env.RESEND_API_KEY);

export const emailService = {
  sendResendEmail: async ({
    from,
    message,
    subject = 'New Support request',
    templateName,
    templateVariables,
  }: SendEmailOptions) => {
    let html: string;
    let text: string;

    if (templateName) {
      const language = templateVariables?.language || 'en';
      const variables = {
        ...templateVariables,
        APP_NAME,
      };

      html = renderMjmlTemplate(templateName, String(language) as SupportedEmailLanguages, variables);
      text = '';
    } else {
      html = message;
      text = message;
    }

    const { data, error } = await resend.emails.send({
      from: `"Support ${APP_NAME}" <${SUPPORT_EMAIL}>`,
      to: SUPPORT_EMAIL,
      replyTo: from,
      subject,
      html,
      text,
    });

    if (error) {
      console.error(error);
      return error;
    }

    return data;
  },
};

export type EmailService = typeof emailService;
