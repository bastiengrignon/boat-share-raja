import type { ContactFormBody } from '@boat-share-raja/shared-types';

import { APP_NAME } from '../../constants';
import { createService } from '../../utils/service';

export const sendEmail = createService<{ Body: ContactFormBody }, boolean>('sendSupportEmail', async (req) => {
  const { userId, name, email, subject, message } = req.body;
  const language = req.language ?? 'en';

  await req.email.sendResendEmail({
    from: email,
    subject,
    templateName: 'supportRequest',
    templateVariables: {
      language,
      name,
      message,
      APP_NAME,
    },
  });

  req.log.info(`Sending email to support from ${email} by user ${userId ?? 'unknown user'}`);

  return {
    status: 'SUCCESS',
    data: true,
  };
});
