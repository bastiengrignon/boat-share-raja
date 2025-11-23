type ApiRoutes = {
  defaultApiPath: string;
  healthcheck: string;
  auth: string;
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
};
