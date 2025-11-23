import { Divider, Paper, Title } from '@mantine/core';
import type { FC, ReactNode } from 'react';

interface SettingsPanelLayoutProps {
  children: ReactNode;
  title: string;
}

const SettingsPanelLayout: FC<SettingsPanelLayoutProps> = ({ children, title }) => (
  <Paper p="md">
    <Title>{title}</Title>
    <Divider my="xl" />
    {children}
  </Paper>
);

export default SettingsPanelLayout;
