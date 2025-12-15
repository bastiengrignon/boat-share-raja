import type { QueryUserId } from '@boat-share-raja/shared-types';

import { boatSharingApi } from '../lib/api';

const moderationRoute = '/moderation';

export const moderationService = {
  blockUser: async ({ userId, blockedUserId }: QueryUserId & { blockedUserId: string }) =>
    (await boatSharingApi.post(`${moderationRoute}/block`, { userId, blockedUserId })).data,
  reportUser: async ({ userId, reportedUserId, reason }: QueryUserId & { reportedUserId: string; reason: string }) =>
    (await boatSharingApi.post(`${moderationRoute}/report`, { userId, reportedUserId, reason })).data,
};
