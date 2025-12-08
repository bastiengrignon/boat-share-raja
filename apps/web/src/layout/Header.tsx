import { Anchor, Flex, Group, Title } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbSpeedboat } from 'react-icons/tb';
import { Link } from 'react-router';

import LanguageSwitcher from '../components/LanguageSwitcher';
import UserMenu from '../components/UserMenu';
import { useMobileQuery } from '../lib/responsive';
import { routes } from '../router';

const Header: FC = () => {
  const { t } = useTranslation('common');
  const isMobile = useMobileQuery();

  return (
    <Flex align="center" justify="space-between" px="md" py="xs" h="100%">
      <Anchor component={Link} to={routes.home} underline="never" c="inherit">
        <Group gap="xs">
          <TbSpeedboat size={26} />
          <Title order={isMobile ? 4 : 3} lineClamp={1} maw="60dvw">
            {t('appName')}
          </Title>
        </Group>
      </Anchor>
      <Group gap="xs">
        <LanguageSwitcher />
        <UserMenu />
      </Group>
    </Flex>
  );
};

export default Header;
