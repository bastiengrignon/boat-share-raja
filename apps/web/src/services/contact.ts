import type { ContactFormMessage } from '@boat-share-raja/shared-types';

import { boatSharingApi } from '../lib/api';

const contactRoute = '/contact';

export const contactService = {
  sendMessage: async (data: ContactFormMessage) => (await boatSharingApi.post(contactRoute, data)).data,
};
