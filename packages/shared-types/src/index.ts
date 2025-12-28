import { z } from 'zod';

export type ApiResult<T> = {
  status: 'SUCCESS' | 'ERROR';
  error?: string | unknown;
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

export type QueryUserId = {
  userId: string;
};

export type QueryConversationId = {
  conversationId: string;
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

export type CreateJourney = Pick<
  Journey,
  'user' | 'numberOfPeople' | 'maxNumberOfPeople' | 'from' | 'to' | 'date' | 'time' | 'price' | 'notes'
>;

export type EditJourney = Omit<Journey, 'id' | 'createdAt' | 'user'> & { fullName: string };

export type AddPeopleToBoat = {
  journeyId: string;
  people: number;
  user: User;
};

export type User = {
  id: string;
  name: string;
  isAnonymous?: boolean | null;
  email?: string;
  emailVerified?: boolean;
};

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

export type JourneyRequestAcceptation = {
  accepted: boolean;
  requestId: string;
};

export type MessageType = 'TEXT' | 'JOURNEY_REQUEST' | 'SYSTEM';

export type JourneyRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export type ContactFormMessage = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  userId?: string;
};

const contactBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().optional(),
  message: z.string().min(1),
  userId: z.string().optional(),
});

const contactSchema = {
  sendSupport: {
    body: contactBodySchema,
  },
};

export const schemas = {
  contactSchema,
};
