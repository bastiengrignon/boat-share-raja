import type { ApiResult } from '@boat-share-raja/shared-types';
import type { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

type CreateServiceCallback<T extends RouteGenericInterface, U> = (
  req: FastifyRequest<T>,
  res: FastifyReply
) => Promise<U>;

export const createService =
  <T extends RouteGenericInterface, U>(serviceName: string, callback: CreateServiceCallback<T, U>) =>
  async (req: FastifyRequest<T>, res: FastifyReply): Promise<ApiResult<U>> => {
    try {
      const startTime = Date.now();
      req.log.info(`Service ${serviceName} started`);

      const result = await callback(req, res);

      const elapsedTime = Date.now() - startTime;
      req.log.info(`Service ${serviceName} finished in ${elapsedTime}ms`);
      return {
        status: 'SUCCESS',
        data: result,
      };
    } catch (error) {
      req.log.error(`Something went terribly wrong while requesting ${serviceName} -> ${error}`);
      return {
        status: 'ERROR',
        error: 'INTERNAL_SERVER_ERROR',
        data: null,
      };
    }
  };
