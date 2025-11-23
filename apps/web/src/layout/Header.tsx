import { Anchor, Avatar, Flex, Group, Menu, Title, UnstyledButton } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbLogout, TbSettings } from 'react-icons/tb';
import { Link } from 'react-router';

import ColorSwitcher from '../components/ColorSwitcher';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Loader from '../components/Loader';
import { useMobileQuery } from '../lib/responsive';
import { routes } from '../router';
import { useLayoutHooks } from './Layout.hooks';

const Header: FC = () => {
  const { t } = useTranslation('common');
  const isMobile = useMobileQuery();
  const { user, signOutLoading, handleLogout } = useLayoutHooks();

  return (
    <Flex align="center" justify="space-between" px="md" py="xs" h="100%">
      <Anchor component={Link} to={routes.home} underline="never" c="inherit">
        <Title order={isMobile ? 4 : 3}>{t('appName')}</Title>
      </Anchor>
      <Group>
        <LanguageSwitcher />
        <ColorSwitcher />
        <Menu width={220} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }} withinPortal>
          <Menu.Target>
            <UnstyledButton>
              <Avatar
                size={isMobile ? 'sm' : 'md'}
                radius="sm"
                color="initials"
                name={`${user?.firstName} ${user?.lastName}`}
                alt={`${user?.firstName} ${user?.lastName}`}
                src={user?.image}
              />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              {user?.firstName} {user?.lastName}
            </Menu.Label>
            <Menu.Item leftSection={<TbSettings size={16} />} component={Link} to={routes.settings}>
              {t('header.settings')}
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={signOutLoading ? <Loader /> : <TbLogout size={16} />}
              onClick={handleLogout}
            >
              {t('header.logout')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Flex>
  );
};

export default Header;
