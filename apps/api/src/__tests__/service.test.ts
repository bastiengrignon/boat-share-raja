/** biome-ignore-all lint/suspicious/noExplicitAny: needed for test purpose */
import type { ApiResult } from '@boat-share-raja/shared-types';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { createService, returnService } from '../utils/service';

describe('service', () => {
  let mockReply: any;
  let mockRequest: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    mockRequest = {
      log: {
        info: vi.fn(),
        error: vi.fn(),
      },
    };
  });

  describe('returnService', () => {
    test('Should return 200 statusCode when status is SUCCESS', () => {
      const response: ApiResult<object> = { status: 'SUCCESS', data: { test: 'test' } };

      returnService(mockReply, response);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(response);
    });

    test('Should return 400 statusCode when status is ERROR', () => {
      const response: ApiResult<null> = { status: 'ERROR', error: 'BAD_REQUEST', data: null };

      returnService(mockReply, response);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith(response);
    });
  });

  describe('createService', () => {
    test('Should execute callback and log start/finish', async () => {
      const mockResult: ApiResult<string> = { status: 'SUCCESS', data: 'Done' };
      const callback = vi.fn().mockResolvedValue(mockResult);

      const result = await createService('testService', callback)(mockRequest as any, mockReply as any);

      expect(callback).toHaveBeenCalledWith(mockRequest, mockReply);
      expect(mockRequest.log.info).toHaveBeenCalledWith(expect.stringContaining('Service testService started'));
      expect(mockRequest.log.info).toHaveBeenCalledWith(expect.stringContaining('Service testService finished'));
      expect(result).toBe(mockResult);
    });

    test('Should catch errors and return INTERNAL_SERVER_ERROR', async () => {
      const error = new Error('Catch it');
      const callback = vi.fn().mockRejectedValue(error);

      await createService('failService', callback)(mockRequest as any, mockReply as any);

      expect(mockRequest.log.error).toHaveBeenCalledWith(
        expect.stringContaining('Something went terribly wrong while requesting failService')
      );

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ERROR',
          error: 'INTERNAL_SERVER_ERROR',
        })
      );
    });
  });
});
