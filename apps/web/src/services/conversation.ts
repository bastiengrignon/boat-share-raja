import type { QueryConversationId, QueryUserId, SendMessage } from '@boat-share-raja/shared-types';

import { boatSharingApi } from '../lib/api';

const conversationRoute = '/conversations';

export const conversationService = {
  getUserConversations: async ({ userId }: QueryUserId) =>
    (await boatSharingApi.get(`${conversationRoute}/${userId}`)).data,
  getConversationInformation: async ({ conversationId }: QueryConversationId) =>
    (await boatSharingApi.get(`${conversationRoute}/${conversationId}/information`)).data,
  getConversationMessages: async ({ conversationId }: QueryConversationId) =>
    (await boatSharingApi.get(`${conversationRoute}/${conversationId}/messages`)).data,
  sendMessage: async ({ conversationId, senderId, content, type }: SendMessage) =>
    (await boatSharingApi.post(`${conversationRoute}/${conversationId}/messages`, { senderId, content, type })).data,
  markConversationAsRead: async ({ conversationId, userId }: QueryConversationId & QueryUserId) =>
    (await boatSharingApi.post(`${conversationRoute}/${conversationId}/read`, { userId })).data,
  checkOrCreateConversation: async ({ userIdA, userIdB }: { userIdA: string; userIdB: string }) =>
    (await boatSharingApi.put(conversationRoute, { userIdA, userIdB })).data,
};
