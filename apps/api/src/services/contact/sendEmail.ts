import type { ContactFormMessage } from '@boat-share-raja/shared-types';

import { APP_NAME } from '../../constants';
import type { EmailLanguages } from '../../utils/email';
import { createService } from '../../utils/service';

export const sendEmail = createService<{ Body: ContactFormMessage }, object>('sendSupportEmail', async (req) => {
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
      APP_NAME,
    },
  });

  req.log.info(`Sending email to support from ${email} by user ${userId ?? 'unknown user'}`);

  return {
    status: 'SUCCESS',
    data: null,
  };
});
