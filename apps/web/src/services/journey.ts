import type {
  AddJourneyBody,
  AddPeopleToJourneyBody,
  AddPeopleToJourneyParams,
  DeleteJourneyParams,
  EditJourneyBody,
  MyJourneysParams,
} from '@boat-share-raja/shared-types';

import { boatSharingApi } from '../lib/api';

const journeyRoute = '/journeys';

export const journeyService = {
  getAll: async () => (await boatSharingApi.get(journeyRoute)).data,
  getMyJourneys: async ({ userId }: MyJourneysParams) =>
    (await boatSharingApi.get(`${journeyRoute}/user/${userId}`)).data,
  addJourney: async (data: AddJourneyBody) => (await boatSharingApi.post(journeyRoute, data)).data,
  addPeopleToJourney: async ({ journeyId, people, user }: AddPeopleToJourneyBody & AddPeopleToJourneyParams) =>
    (await boatSharingApi.post(`${journeyRoute}/${journeyId}/people`, { people, user })).data,
  updateJourney: async (journey: EditJourneyBody) =>
    (await boatSharingApi.put(`${journeyRoute}/${journey.id}`, journey)).data,
  deleteJourney: async ({ journeyId }: DeleteJourneyParams) =>
    (await boatSharingApi.delete(`${journeyRoute}/${journeyId}`)).data,
};
