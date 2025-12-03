import type { FastifyInstance, RouteOptions } from 'fastify';

import { API_ROUTES } from '../constants';

const COLORS = {
  yellow: 33,
  green: 32,
  blue: 34,
  red: 31,
  grey: 90,
  magenta: 35,
  clear: 39,
};

const colorText = (color: number, string: string) => `\u001b[${color}m${string}\u001b[${COLORS.clear}m`;

const colorMethods = {
  POST: colorText(COLORS.yellow, 'POST'),
  GET: colorText(COLORS.green, 'GET'),
  PUT: colorText(COLORS.blue, 'PUT'),
  DELETE: colorText(COLORS.red, 'DELETE'),
  PATCH: colorText(COLORS.grey, 'PATCH'),
};

const colorMethod = (method: keyof typeof colorMethods) => colorMethods[method] || method;

const displayRoutes = (routes: RouteOptions[]) => {
  if (routes.length === 0) {
    console.warn('No routes found.');
    return;
  }

  routes
    .toSorted((a, b) => a.url.localeCompare(b.url))
    .forEach(({ method, url }) => {
      if (method !== 'HEAD') {
        console.info(
          `${colorMethod(method as keyof typeof colorMethods)}\t${url.replace(API_ROUTES.defaultApiPath, '')}`
        );
      }
    });
};

export const printFastifyRoutes = ({ app }: { app: FastifyInstance }) => {
  const routes: RouteOptions[] = [];
  app.addHook('onRoute', (route: RouteOptions) => {
    routes.push(route);
  });
  app.addHook('onReady', (done) => {
    displayRoutes(routes);
    done();
  });
};
