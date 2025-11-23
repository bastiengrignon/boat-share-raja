import { AppShell, LoadingOverlay } from '@mantine/core';
import type { FC } from 'react';
import { Outlet } from 'react-router';

import Header from './Header';
import { useLayoutHooks } from './Layout.hooks';
import classes from './Layout.module.css';

const Layout: FC = () => {
  const { session, isPending } = useLayoutHooks();
  return (
    <>
      {isPending ? (
        <LoadingOverlay visible />
      ) : (
        <AppShell header={{ height: 60 }} disabled={!session} padding="sm" className={classes.appShellContainer}>
          <AppShell.Header>
            <Header />
          </AppShell.Header>
          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
        </AppShell>
      )}
    </>
  );
};

export default Layout;
