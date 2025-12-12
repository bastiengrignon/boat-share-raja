import { AppShell } from '@mantine/core';
import type { FC } from 'react';
import { Outlet } from 'react-router';

import Footer from './Footer';
import Header from './Header';
import { useLayoutHooks } from './Layout.hooks';
import classes from './Layout.module.css';

const Layout: FC = () => {
  const { isInsideConversation, isSettingsRoute, footerRef } = useLayoutHooks();
  return (
    <AppShell
      footer={{ height: 60, collapsed: !isSettingsRoute }}
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
      <AppShell.Footer ref={footerRef} p="xs">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default Layout;
