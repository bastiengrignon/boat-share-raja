import { ActionIcon, Menu } from '@mantine/core';
import type { FC } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from '../../lib/i18n';
import { useMobileQuery } from '../../lib/responsive';

const languageMapping = (code: string) => (code === 'en' ? 'US' : code);

const LanguageSwitcher: FC = () => {
  const { t, i18n } = useTranslation('common');
  const isMobile = useMobileQuery();
  return (
    <Menu radius="md" withinPortal position="bottom-end">
      <Menu.Target>
        <ActionIcon size={isMobile ? 'md' : 'lg'} variant="light">
          <ReactCountryFlag countryCode={languageMapping(i18n.resolvedLanguage || 'fr')} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {SUPPORTED_LANGUAGES.map((language) => (
          <Menu.Item
            key={language}
            leftSection={<ReactCountryFlag countryCode={languageMapping(language)} />}
            onClick={() => i18n.changeLanguage(language)}
          >
            {t(`languages.${language}`)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitcher;
