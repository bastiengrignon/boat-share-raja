/** biome-ignore-all lint/style/noMagicNumbers: compute session expiration and cache */
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { anonymous } from 'better-auth/plugins';
import { localization } from 'better-auth-localization';

import { TIME } from '../constants';
import { prisma } from '../middlewares/prisma';
import serverConfig from './config';
import env from './env';

const adjectives = ['Brave', 'Calm', 'Swift', 'Bright', 'Lucky', 'Silent', 'Mighty', 'Clever', 'Gentle', 'Bold'];

const animals = ['Dolphin', 'Tiger', 'Fox', 'Eagle', 'Panda', 'Wolf', 'Falcon', 'Otter', 'Hawk', 'Lion'];

const generateName = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `Anonymous ${adjective} ${animal} ${number}`;
};

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  trustedOrigins: serverConfig.trustedOrigins,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  advanced: {
    database: {
      generateId: 'uuid',
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
