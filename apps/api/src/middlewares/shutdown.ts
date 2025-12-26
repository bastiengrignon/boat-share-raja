import type { FastifyInstance } from 'fastify';

const listeners = ['SIGINT', 'SIGTERM'];

const gracefullyShutdown = async ({ app }: { app: FastifyInstance }) => {
  process.on('unhandledRejection', (error) => {
    app.log.error(error);
    process.exit(1);
  });
  listeners.forEach((signal) => {
    process.on(signal, async () => {
      await app.close();
      app.log.info(`Received ${signal}, shutting down gracefully`);
      process.exit(0);
    });
  });
};

export default gracefullyShutdown;
