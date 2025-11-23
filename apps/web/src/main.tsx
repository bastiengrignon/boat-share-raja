import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { client } from './lib/queryClient';
import { router } from './router';
import { theme } from './theme';

import './lib/i18n';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// biome-ignore lint/style/noNonNullAssertion: root is defined
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <RouterProvider router={router} />
      </MantineProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
