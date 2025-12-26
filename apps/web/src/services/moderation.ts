import type { BlockUserBody, ReportUserBody } from '@boat-share-raja/shared-types';

import { boatSharingApi } from '../lib/api';

const moderationRoute = '/moderation';

export const moderationService = {
  blockUser: async ({ userId, blockedUserId }: BlockUserBody) =>
    (await boatSharingApi.post(`${moderationRoute}/block`, { userId, blockedUserId })).data,
  reportUser: async ({ userId, reportedUserId, reason }: ReportUserBody) =>
    (await boatSharingApi.post(`${moderationRoute}/report`, { userId, reportedUserId, reason })).data,
};
