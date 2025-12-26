import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

import type { Environment } from './src/utils/env';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx ./prisma/seed.ts',
  },
  datasource: {
    url: env<Environment>('DATABASE_URL'),
  },
});
