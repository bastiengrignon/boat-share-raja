import { Card, Center, Stack, Title } from '@mantine/core';
import type { FC, ReactNode } from 'react';

import { useAuthLayoutHooks } from './AuthLayout.hooks';

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({ title, children }) => {
  useAuthLayoutHooks();
  return (
    <Center h="100svh">
      <Card w={420}>
        <Stack>
          <Title order={3} ta="center" mb="xl">
            {title}
          </Title>
        </Stack>
        {children}
      </Card>
    </Center>
  );
};

export default AuthLayout;
