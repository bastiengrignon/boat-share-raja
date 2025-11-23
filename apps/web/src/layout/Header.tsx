import {Anchor, Flex, Group, Title} from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import ColorSwitcher from '../components/ColorSwitcher';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useMobileQuery } from '../lib/responsive';
import { routes } from '../router';

const Header: FC = () => {
  const { t } = useTranslation('common');
  const isMobile = useMobileQuery();

  return (
    <Flex align="center" justify="space-between" px="md" py="xs" h="100%">
      <Anchor component={Link} to={routes.home} underline="never" c="inherit">
        <Title order={isMobile ? 4 : 3}>{t('appName')}</Title>
      </Anchor>
      <Group>
        <LanguageSwitcher />
        <ColorSwitcher />
      </Group>
    </Flex>
  );
};

export default Header;
