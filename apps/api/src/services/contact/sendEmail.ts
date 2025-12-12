import type { ApiResult, ContactFormMessage } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

import type { EmailLanguages } from '../../utils/email';

export const sendEmail = async (req: FastifyRequest<{ Body: ContactFormMessage }>): Promise<ApiResult<object>> => {
  const { userId, name, email, subject, message } = req.body;
  const language = req.language ?? 'en';

  await req.email.sendSupportEmail({
    subject,
    from: email,
    templateName: 'supportRequest',
    language: language as EmailLanguages,
    templateData: {
      name,
      message,
      APP_NAME: 'Boat share raja Ampat',
    },
  });

  req.log.info(`Sending email to support from ${email} by user ${userId ?? 'unknown user'}`);

  return {
    status: 'SUCCESS',
    data: null,
  };
};
