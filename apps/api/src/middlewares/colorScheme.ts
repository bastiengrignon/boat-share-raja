import fp from 'fastify-plugin';

const parseColorScheme = (value?: string | string[]): 'light' | 'dark' | undefined => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;

  const normalized = raw.trim().toLowerCase();
  if (normalized === 'dark' || normalized === 'light') return normalized;

  return undefined;
};

export const colorSchemePlugin = fp(async (app) => {
  app.addHook('onRequest', async (request) => {
    request.clientColorScheme = parseColorScheme(request.headers['X-Color-Scheme']);
  });
});
