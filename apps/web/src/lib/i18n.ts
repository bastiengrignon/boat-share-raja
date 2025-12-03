import dayjs from 'dayjs';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import 'dayjs/locale/fr';

const NAMESPACES = ['common', 'home', 'journeys', 'messages'];
export const SUPPORTED_LANGUAGES = ['fr', 'en'];

type Namespace = (typeof NAMESPACES)[number];
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const bindNamespacesByLanguage =
  (language: SupportedLanguage) => async (namespaceList: Promise<object>, namespace: Namespace) => ({
    ...(await namespaceList),
    [namespace]: (await import(`../i18n/${language}/${namespace}.json`)).default,
  });
const indexTranslationsByLanguage = async (resourceList: Promise<object>, language: SupportedLanguage) => {
  const translations = await NAMESPACES.reduce(bindNamespacesByLanguage(language), Promise.resolve({}));
  return { ...(await resourceList), [language]: translations };
};

const resources = await SUPPORTED_LANGUAGES.reduce(indexTranslationsByLanguage, Promise.resolve({}));

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    ns: NAMESPACES,
    defaultNS: 'common',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
  });

dayjs.locale(i18n.resolvedLanguage);

i18n.on('languageChanged', (lng) => {
  dayjs.locale(lng);
});

export default i18n;
