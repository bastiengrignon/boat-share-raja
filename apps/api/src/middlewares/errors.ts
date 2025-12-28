import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

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

  if ((error as FastifyError).validation) {
    const fastifyError = error as FastifyError;
    request.log.error(`${VALIDATION_ERROR}: ${fastifyError.message}`);
    return reply.status(fastifyError.statusCode || 400).send({
      status: 'ERROR',
      error: fastifyError.message,
      data: fastifyError.validation,
    });
  }
  const errorMessage = error instanceof Error ? error.message : String(error);
  request.log.error(`${INTERNAL_SERVER_ERROR}: ${errorMessage}`);
  return reply.status(500).send({
    status: 'ERROR',
    error: INTERNAL_SERVER_ERROR,
    data: error,
  });
};
