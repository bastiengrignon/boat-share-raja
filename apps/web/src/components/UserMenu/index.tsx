import { Avatar, Indicator, Menu, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbMessages, TbMoon, TbRoute, TbSettings, TbSun } from 'react-icons/tb';
import { Link } from 'react-router';

import { useMobileQuery } from '../../lib/responsive';
import { routes } from '../../router';
import { useUserMenuHooks } from './UserMenu.hooks';

const UserMenu: FC = () => {
  const { t } = useTranslation();
  const isMobile = useMobileQuery();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const { user, isNewMessages } = useUserMenuHooks();

  return (
    <Menu withArrow position="bottom-end">
      <Menu.Target>
        <Indicator color="red" disabled={!isNewMessages}>
          <Avatar style={{ cursor: 'pointer' }} variant="light" color="blue" size={isMobile ? 28 : 34} radius="sm" />
        </Indicator>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{user?.name}</Menu.Label>
        <Menu.Item leftSection={<TbRoute />} component={Link} to={routes.journeys}>
          {t('header.menu.myJourneys')}
        </Menu.Item>
        <Menu.Item
          leftSection={<TbMessages />}
          rightSection={<Indicator color="red" size={6} disabled={!isNewMessages} />}
          component={Link}
          to={routes.messages.home}
        >
          {t('header.menu.myMessages')}
        </Menu.Item>
        <Menu.Item leftSection={<TbSettings />} component={Link} to={routes.settings}>
          {t('header.menu.settings')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={computedColorScheme === 'light' ? <TbMoon /> : <TbSun />}
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        >
          {computedColorScheme === 'light' ? t('header.menu.darkMode') : t('header.menu.lightMode')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
