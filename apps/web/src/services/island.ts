import { boatSharingApi } from '../lib/api';

const islandRoute = '/islands';

export const islandService = {
  getAll: async () => (await boatSharingApi.get(islandRoute)).data,
};
