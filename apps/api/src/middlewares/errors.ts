import type { FastifyReply, FastifyRequest } from 'fastify';
import { type ZodAny, ZodError } from 'zod';

const INTERNAL_SERVER_ERROR = 'Internal Server Error';
const VALIDATION_ERROR = 'Validation Error';

export const errorHandler = (error: unknown, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    const formattedError = `[${String(firstError?.path[0])}] ${firstError?.message}`;
    request.log.error(`${VALIDATION_ERROR}: ${formattedError}`);
    return reply.status(400).send({
      status: 'ERROR',
      error: `${VALIDATION_ERROR}: ${formattedError}`,
      data: {
        message: error.message,
        details: error.issues,
      },
    });
  }
  request.log.error(`${INTERNAL_SERVER_ERROR}: ${error}`);
  return reply.status(500).send({
    status: 'ERROR',
    error: INTERNAL_SERVER_ERROR,
    data: error,
  });
};

export const zodValidatorCompiler =
  ({ schema }: { schema: ZodAny }) =>
  // biome-ignore lint/suspicious/noExplicitAny: unknown data
  (data: any) => {
    const result = schema.safeParse(data);
    if (result.error) {
      return { error: result.error };
    }
    return { value: result.data };
  };

export const serializerCompiler =
  ({ schema }: { schema: ZodAny }) =>
  // biome-ignore lint/suspicious/noExplicitAny: unknown data
  (data: any) => {
    const result = schema.safeParse(data);
    console.log({ result });
    if (result.success) {
      return JSON.stringify(result.data);
    }
    throw new Error(`Serialization failed: ${result.error.message}`);
  };
