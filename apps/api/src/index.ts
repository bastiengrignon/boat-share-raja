import Fastify from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { v4 as uuidv4 } from 'uuid';

import shutdown from './middlewares/shutdown';
import { initRoutes } from './router';
import serverConfig from './utils/config';
import env from './utils/env';

const main = async () => {
  const app = Fastify({
    logger: serverConfig.logger[env.ENV] ?? true,
    disableRequestLogging: true,
    genReqId: () => uuidv4(),
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      request.log.error(error.message);
      return reply.code(400).send({
        status: 'ERROR',
        error: 'Response Validation Error',
        message: "Request doesn't match the schema",
        data: {
          issues: error.validation,
          method: request.method,
          url: request.url,
        },
      });
    }

    if (isResponseSerializationError(error)) {
      request.log.error(error.message);
      return reply.code(500).send({
        status: 'ERROR',
        error: 'Internal Server Error',
        message: "Response doesn't match the schema",
        data: {
          issues: error.cause.issues,
          method: error.method,
          url: error.url,
        },
      });
    }
    request.log.error(error);
  });

  await initRoutes({ app });

  try {
    await app.listen({ port: Number(env.PORT), host: '0.0.0.0' });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }

  await shutdown({ app });
};

main();
