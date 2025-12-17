import axios from 'axios';

import i18n from './i18n';

const clientLanguage =
  i18n.resolvedLanguage ||
  i18n.language ||
  localStorage.getItem('i18nextLng') ||
  localStorage.getItem('language') ||
  localStorage.getItem('lang') ||
  navigator.language ||
  'en';

const getClientColorScheme = (): 'light' | 'dark' | undefined => {
  const stored = localStorage.getItem('mantine-color-scheme-value');
  if (stored === 'dark' || stored === 'light') return stored;

  if (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) return 'dark';
  return 'light';
};

export const boatSharingApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
});

boatSharingApi.interceptors.request.use((config) => {
  const colorScheme = getClientColorScheme();
  config.headers = config.headers ?? {};
  config.headers['Accept-Language'] = clientLanguage;
  if (colorScheme) {
    config.headers['X-Color-Scheme'] = colorScheme;
  }

  return config;
});
