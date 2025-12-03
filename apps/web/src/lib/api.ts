import axios from 'axios';

export const boatSharingApi = axios.create({
  baseURL: String(import.meta.env.VITE_API_URL),
  timeout: 10000,
});
