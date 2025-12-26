import type { ContactFormBody } from '@boat-share-raja/shared-types';

import { boatSharingApi } from '../lib/api';

const contactRoute = '/contact';

export const contactService = {
  sendMessage: async (data: ContactFormBody) => (await boatSharingApi.post(contactRoute, data)).data,
};
