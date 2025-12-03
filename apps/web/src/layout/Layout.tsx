import { AppShell } from '@mantine/core';
import type { FC } from 'react';
import { Outlet } from 'react-router';

import Header from './Header';
import { useLayoutHooks } from './Layout.hooks';
import classes from './Layout.module.css';

const Layout: FC = () => {
  const { isInsideConversation } = useLayoutHooks();
  return (
    <AppShell
      header={{ height: 60, collapsed: isInsideConversation }}
      padding="sm"
      className={classes.appShellContainer}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
