import fp from 'fastify-plugin';

const parseAcceptLanguage = (value?: string | string[]): string | undefined => {
  const raw = Array.isArray(value) ? value.join(',') : value;
  if (!raw) return undefined;

  // Exemple: "fr-CH,fr;q=0.9,en;q=0.8"
  const first = raw.split(',')[0]?.trim();
  if (!first) return undefined;

  // On retire un éventuel ";q=..."
  return first.split(';')[0]?.trim() || undefined;
};

export const languagePlugin = fp(async (app) => {
  app.addHook('onRequest', async (request) => {
    request.language = parseAcceptLanguage(request.headers['Accept-Language']);
  });
});
