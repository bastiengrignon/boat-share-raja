import type { ApiResult, ContactFormMessage } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

export const sendEmail = async (req: FastifyRequest<{ Body: ContactFormMessage }>): Promise<ApiResult<object>> => {
  const { userId, name, email, subject, message } = req.body;

  req.log.info(`Sending email to ${email} by user ${userId ?? 'unknown user'}`);
  req.log.info({ userId, name, email, subject, message });
  return {
    status: 'SUCCESS',
    data: null,
  };
};
