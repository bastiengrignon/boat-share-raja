import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { anonymous } from 'better-auth/plugins';
import { localization } from 'better-auth-localization';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { API_ROUTES, APP_NAME_SHORT, HTTP_CODES, TIME } from '../constants';
import serverConfig from './config';
import env from './env';
import { prisma } from './prisma';
import { slug } from './string';

const adjectives = ['Brave', 'Calm', 'Swift', 'Bright', 'Lucky', 'Silent', 'Mighty', 'Clever', 'Gentle', 'Bold'];

const animals = ['Dolphin', 'Tiger', 'Fox', 'Eagle', 'Panda', 'Wolf', 'Falcon', 'Otter', 'Hawk', 'Lion'];

const generateName = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `Anonymous ${adjective} ${animal} ${number}`;
};

export const auth = betterAuth({
  appName: slug(APP_NAME_SHORT),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: `${API_ROUTES.defaultApiPath}${API_ROUTES.auth}`,
  trustedOrigins: serverConfig.trustedOrigins,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  advanced: {
    database: {
      generateId: 'uuid',
    },
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
    },
  },
  session: {
    expiresIn: TIME.SECONDS_IN_ONE_DAY * 7,
    updateAge: TIME.SECONDS_IN_ONE_DAY,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    anonymous({
      generateName,
    }),
    localization({
      defaultLocale: 'fr-FR',
      fallbackLocale: 'default',
    }),
  ],
});

export const fastifyBetterAuthHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    const headers = new Headers();
    Object.entries(request.headers).forEach(([key, value]) => {
      if (value) headers.append(key, value.toString());
    });

    const req = new Request(url.toString(), {
      method: request.method,
      headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
    });

    const response = await auth.handler(req);

    reply.status(response.status);
    response.headers.forEach((value, key) => {
      reply.header(key, value);
    });
    reply.send(response.body ? await response.text() : null);
  } catch (error) {
    request.log.error(`Authentication Error: ${error}`);
    reply.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send({
      error: 'Internal authentication error',
      code: 'AUTH_FAILURE',
    });
  }
};
