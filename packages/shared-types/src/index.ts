export type ApiResult<T> = {
  status: string;
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
  accepted: boolean;
  declined: boolean;
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

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  extra?: MessageExtraJourneyRequest;
  updatedAt: string;
};

export type SendMessage = QueryConversationId & {
  senderId: string;
  content: string;
  extra?: MessageExtraJourneyRequest;
};

export type MessageExtraJourneyRequest = unknown & {
  type: string;
  id: string;
};

export type JourneyRequestAcceptation = {
  accepted: boolean;
  requestId: string;
};
