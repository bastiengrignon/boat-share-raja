/** biome-ignore-all lint/suspicious/noExplicitAny: needed for test purpose */

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { blockUser } from './blockUser';
import { reportUser } from './reportUser';

describe('Moderation Service', () => {
  let mockReply: any;
  let mockRequest: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockImplementation((payload) => payload),
    };

    mockRequest = {
      log: {
        info: vi.fn(),
        error: vi.fn(),
      },
      prisma: {
        user: {
          findFirst: vi.fn(),
        },
        userBlock: {
          upsert: vi.fn(),
        },
        userReport: {
          create: vi.fn(),
        },
      },
    };
  });

  describe('blockUser', () => {
    test('Should fail if user tries to block themselves', async () => {
      mockRequest.body = {
        userId: '63502eaf-df50-4a19-a145-50a1332189b6',
        blockedUserId: '63502eaf-df50-4a19-a145-50a1332189b6',
      };

      await blockUser(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ERROR',
          error: 'CANNOT_BLOCK_YOURSELF',
        })
      );
    });

    test('Should fail if the blocker user is not found', async () => {
      mockRequest.body = {
        userId: '17988808-be03-4082-add7-d109805bd494',
        blockedUserId: '74bc9641-332b-40d2-a352-69fde583b1a0',
      };
      mockRequest.prisma.user.findFirst.mockResolvedValueOnce(null);

      await blockUser(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ERROR',
          error: 'USER_NOT_FOUND',
        })
      );
    });

    test('Should fail if the user to block is not found', async () => {
      mockRequest.body = {
        userId: '6f627e9f-3acf-4628-b5ee-1039b7da25fa',
        blockedUserId: '2435152f-bf9a-4641-ae0b-12ead2a2f173',
      };
      mockRequest.prisma.user.findFirst
        .mockResolvedValueOnce({ id: '6f627e9f-3acf-4628-b5ee-1039b7da25fa' })
        .mockResolvedValueOnce(null);

      await blockUser(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'USER_TO_BLOCK_NOT_FOUND',
        })
      );
    });

    test('Should block user successfully', async () => {
      mockRequest.body = {
        userId: '3978dac7-cc43-4fba-83be-e7a6bf53b1a5',
        blockedUserId: 'b1ce1cd4-8a1a-478f-b81a-f4e73f8235db',
      };
      mockRequest.prisma.user.findFirst
        .mockResolvedValueOnce({ id: '3978dac7-cc43-4fba-83be-e7a6bf53b1a5' })
        .mockResolvedValueOnce({ id: 'b1ce1cd4-8a1a-478f-b81a-f4e73f8235db' });
      mockRequest.prisma.userBlock.upsert.mockResolvedValueOnce({ id: '197e6018-6dbd-4d2b-865d-b6159cdc1f5e' });

      await blockUser(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'SUCCESS',
          data: { id: '197e6018-6dbd-4d2b-865d-b6159cdc1f5e' },
        })
      );
    });
  });

  describe('reportUser', () => {
    test('Should fail if user tries to report themselves', async () => {
      mockRequest.body = {
        userId: 'fb060ab6-ea4a-4dad-a692-e60c9a11307a',
        reportedUserId: 'fb060ab6-ea4a-4dad-a692-e60c9a11307a',
        reason: 'Spam',
      };

      await reportUser(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'CANNOT_REPORT_YOURSELF',
        })
      );
    });

    test('Should report user successfully', async () => {
      const mockReport = { id: '0fc0a762-07aa-4575-a7af-a3ff653958c7', reason: 'Spam' };
      mockRequest.body = {
        userId: '11b334e8-820e-4893-bf22-c85986e2d63e',
        reportedUserId: 'f5e5bd0c-a423-4778-8a65-3b34c61a8af6',
        reason: 'Spam',
      };
      mockRequest.prisma.userReport.create.mockResolvedValueOnce(mockReport);

      await reportUser(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'SUCCESS',
          data: { report: mockReport },
        })
      );
    });
  });
});
