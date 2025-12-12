import {} from 'fastify'
import { PrismaClient } from '@prisma/client'
import {EmailService} from "./utils/email";

declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient;
    email: EmailService;
    language?: string;
    clientColorScheme?: 'dark' | 'light';
  }
  interface FastifyInstance {
    prisma: PrismaClient;
    email: EmailService;
  }
}
