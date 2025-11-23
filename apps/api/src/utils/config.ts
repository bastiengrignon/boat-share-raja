export default {
  trustedOrigins: ['http://localhost:5173'],
  logger: {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          redact: {
            paths: ['password', 'token', 'secrets', 'headers.authorization'],
            censor: '*** [HIDDEN VARIABLE] ***',
          },
        },
      },
    },
    production: true,
    test: false,
  },
};
