import {AppShell} from '@mantine/core';
import type { FC } from 'react';
import { Outlet } from 'react-router';

import Header from './Header';
import classes from './Layout.module.css';

const Layout: FC = () => {
  return (
    <AppShell header={{height: 60}} padding="sm" className={classes.appShellContainer}>
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet/>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
