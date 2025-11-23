/** biome-ignore-all lint/style/noMagicNumbers: compute session expiration and cache */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { localization } from 'better-auth-localization';

import { TIME } from '../constants';
import serverConfig from './config';
import { sendEmail } from './email';
import env from './env';

const prisma = new PrismaClient();

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: serverConfig.trustedOrigins,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    password: {
      hash: async (password) => await bcrypt.hash(password, 10),
      verify: async ({ hash, password }) => await bcrypt.compare(password, hash),
    },
    sendResetPassword: async ({ user, url }) =>
      await sendEmail({
        subject: `Reset password for ${user.name}`,
        body: `Click on the link ${url} to reset your password`,
      }),
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
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
    localization({
      defaultLocale: 'fr-FR',
      fallbackLocale: 'default',
    }),
  ],
});
