import {} from 'fastify'
import {PrismaClient} from '@prisma/client'
import {EmailService} from "./utils/email";
import {User} from "@boat-share-raja/shared-types";
import {Session} from "better-auth";

declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient;
    email: EmailService;
    language?: string;
    clientColorScheme?: 'dark' | 'light';
    user?: User | null;
    session?: Session | null;
  }

  interface FastifyInstance {
    prisma: PrismaClient;
    email: EmailService;
  }
}
