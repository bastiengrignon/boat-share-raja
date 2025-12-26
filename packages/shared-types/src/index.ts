import type { z } from 'zod';

import { contactSchema } from './contact';
import type { queryConversationId, queryUserIdSchema, userSchema } from './helpers';
import { journeySchemas } from './journey';
import { journeyRequestSchemas } from './journeyRequest';
import { moderationSchemas } from './moderation';

export type ApiResult<T> = {
  status: 'SUCCESS' | 'ERROR';
  error?: string;
  data: T | null;
};

export type KeyBoolean = {
  [key: string]: boolean;
};

export type KeyObject<T> = {
  [key: string]: T;
};

export type QueryId = {
  id: string;
};

export type QueryUserId = z.infer<typeof queryUserIdSchema>;

export type QueryConversationId = z.infer<typeof queryConversationId>;

export type QueryRequestId = {
  requestId: string;
};

export type Journey = {
  id: string;
  user: User;
  numberOfPeople: number;
  maxNumberOfPeople: number;
  from: string;
  to: string;
  date: Date;
  time?: string;
  price?: number | null;
  notes?: string;
  createdAt: string;
  journeyRequest: JourneyRequest[];
};

export type JourneyRequest = {
  id: string;
  journeyId: string;
  people: number;
  requesterId: string;
  status: JourneyRequestStatus;
  createdAt: string;
  journey: Journey;
};

export type User = z.infer<typeof userSchema>;

export type Island = {
  id: string;
  name: string;
};

export type Conversation = {
  id: string;
  title?: string | null;
  isGroup?: boolean;
  updatedAt: string;
  messages: Message[];
  participants: ConversationParticipant[];
  unreadCount?: number;
};

export type ConversationParticipant = {
  id: string;
  conversationId: string;
  userId: string;
  user: User;
  joinedAt: string;
};

export type ArchivedConversation = {
  id: string;
  userId: string;
  otherUserId: string;
  user: User;
  otherUser: User;
  archivedAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: MessageType;
  extra?: MessageExtraType;
  updatedAt: string;
};

export type SendMessage = QueryConversationId & {
  senderId: string;
  content: string;
  type?: MessageType;
  extra?: MessageExtraType;
};

export type MessageExtraType = unknown & MessageExtraTypeJourneyRequest;

export type MessageExtraTypeJourneyRequest = {
  journeyRequestId: string;
  journeyId: string;
  people: number;
};

export type MessageType = 'TEXT' | 'JOURNEY_REQUEST' | 'SYSTEM';

export type JourneyRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export const schemas = {
  contactSchema,
  journeyRequestSchemas,
  journeySchemas,
  moderationSchemas,
};

export type ContactFormBody = z.infer<typeof contactSchema.body>;

export type JourneyRequestAcceptationBody = z.infer<typeof journeyRequestSchemas.journeyRequestAcceptation.body>;
export type JourneyRequestGet = z.infer<typeof journeyRequestSchemas.journeyRequestGet.params>;

export type AddJourneyBody = z.infer<typeof journeySchemas.addJourney.body>;
export type EditJourneyBody = z.infer<typeof journeySchemas.editJourney.body>;
export type EditJourneyParams = z.infer<typeof journeySchemas.editJourney.params>;
export type DeleteJourneyParams = z.infer<typeof journeySchemas.deleteJourney.params>;
export type MyJourneysParams = z.infer<typeof journeySchemas.myJourneys.params>;
export type AddPeopleToJourneyBody = z.infer<typeof journeySchemas.addPeopleToJourney.body>;
export type AddPeopleToJourneyParams = z.infer<typeof journeySchemas.addPeopleToJourney.params>;

export type BlockUserBody = z.infer<typeof moderationSchemas.blockUser.body>;
export type ReportUserBody = z.infer<typeof moderationSchemas.reportUser.body>;
