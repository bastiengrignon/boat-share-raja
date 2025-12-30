import type { ContactFormMessage } from '@boat-share-raja/shared-types';

import { APP_NAME } from '../../constants';
import { createService, returnService } from '../../utils/service';

export const sendEmail = createService<{ Body: ContactFormMessage }, boolean>('sendSupportEmail', async (req, rep) => {
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

  return returnService(rep, {
    status: 'SUCCESS',
    data: true,
  });
});
