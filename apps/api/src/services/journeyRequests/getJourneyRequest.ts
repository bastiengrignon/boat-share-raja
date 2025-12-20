import { createService } from '../../utils/service';

export const getJourneyRequest = createService<{ Params: { requestId: string } }, object>(
  'getJourneyRequest',
  async (req) => {
    const { requestId } = req.params;
    const journeyRequest = await req.prisma.journeyRequest.findFirst({
      where: {
        id: requestId,
      },
      include: {
        journey: true,
      },
    });
    if (!journeyRequest) {
      return {
        status: 'ERROR',
        error: 'REQUEST_NOT_FOUND',
        data: null,
      };
    }

    return {
      status: 'SUCCESS',
      data: {
        journeyRequest,
      },
    };
  }
);
