import Fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';

import { gracefullyShutdown } from './middlewares/shutdown';
import { initRoutes } from './router';
import serverConfig from './utils/config';
import env from './utils/env';

const main = async () => {
  const app = Fastify({
    logger: serverConfig.logger[env.ENV] ?? true,
    disableRequestLogging: true,
    genReqId: () => uuidv4(),
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    return reply.status(500).send({
      status: 'ERROR',
      error: 'Internal Server Error',
      data: error,
    });
  });

  await initRoutes({ app });

  try {
    await app.listen({ port: Number(env.PORT), host: '0.0.0.0' });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }

  await gracefullyShutdown({ app });
};

main();
