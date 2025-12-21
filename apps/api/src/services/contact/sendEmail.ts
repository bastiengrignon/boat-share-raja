import type { ContactFormMessage } from '@boat-share-raja/shared-types';

import { createService } from '../../utils/service';

export const sendEmail = createService<{ Body: ContactFormMessage }, boolean>('sendSupportEmail', async (req) => {
  const { userId, name, email, subject, message } = req.body;

  await req.email.sendResendEmail({
    from: email,
    subject,
    message: `New message from ${name}(${userId}) with the following request: ${message}`,
  });

  req.log.info(`Sending email to support from ${email} by user ${userId ?? 'unknown user'}`);

  return {
    status: 'SUCCESS',
    data: true,
  };
});
