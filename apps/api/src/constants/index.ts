type ApiRoutes = {
  defaultApiPath: string;
  healthcheck: string;
  auth: string;
  journeys: string;
  journeyRequests: string;
  islands: string;
  conversations: string;
  contact: string;
  moderation: string;
};

export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const TIME = {
  SECONDS_IN_ONE_DAY: 86400,
};

export const API_ROUTES: ApiRoutes = {
  defaultApiPath: '/api',
  healthcheck: '/healthcheck',
  auth: '/auth',
  journeys: '/journeys',
  journeyRequests: '/journey-requests',
  islands: '/islands',
  conversations: '/conversations',
  contact: '/contact',
  moderation: '/moderation',
};

export const AUTOMATED_MESSAGES = {
  REQUEST_PEOPLE_JOURNEY: {
    fr: (people: number) => `Salut ! Est-ce qu’il reste ${people} place${people > 1 ? 's' : ''} à bord ?`,
    en: (people: number) => `Hello! Is there still ${people} place${people > 1 ? 's' : ''} onboard?`,
  },
  REQUEST_PEOPLE_JOURNEY_ACCEPTED: {
    fr: 'Votre demande à été acceptée.',
    en: 'Your request has been accepted.',
  },
  REQUEST_PEOPLE_JOURNEY_DECLINED: {
    fr: 'Votre demande à été refusée.',
    en: 'Your request has been declined.',
  },
};

export const SUPPORT_EMAIL = 'support@bastiengrignon.fr';
export const APP_NAME_SHORT = 'Boat share';
export const APP_NAME = `${APP_NAME_SHORT} Raja Ampat`;
