import { createService, returnService } from '../../utils/service';

export const getJourneyRequest = createService<{ Params: { requestId: string } }, object>(
  'getJourneyRequest',
  async (req, rep) => {
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
      return returnService(rep, {
        status: 'ERROR',
        error: 'REQUEST_NOT_FOUND',
        data: null,
      });
    }

    return returnService(rep, {
      status: 'SUCCESS',
      data: {
        journeyRequest,
      },
    });
  }
);
