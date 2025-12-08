import type { JourneyRequestStatus, MessageType } from '@boat-share-raja/shared-types';

export const DATE_READABLE_FORMAT = 'DD MMMM YYYY';
export const DATE_READABLE_SHORT_FORMAT = 'DD MMM YYYY';
export const DATE_FORMAT = 'DD/MM/YY';

export const MESSAGE_TYPES = {
  TEXT: 'TEXT',
  JOURNEY_REQUEST: 'JOURNEY_REQUEST',
} as const satisfies { [K in MessageType]: K };

export const JOURNEY_REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
} as const satisfies { [K in JourneyRequestStatus]: K };
