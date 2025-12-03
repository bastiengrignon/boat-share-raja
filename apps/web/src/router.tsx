import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

import Conversation from './components/Conversation';

const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));
const Layout = lazy(() => import('./layout/Layout'));
const MyMessages = lazy(() => import('./pages/MyMessages'));
const MyJourneys = lazy(() => import('./pages/MyJourneys'));

interface Routes {
  home: string;
  journeys: string;
  messages: {
    home: string;
    conversation: string;
  };
  settings: string;
}

export const routes: Routes = {
  home: '/',
  journeys: '/journeys',
  messages: {
    home: '/messages',
    conversation: '/messages/:conversationId',
  },
  settings: '/settings',
};

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: routes.home,
        Component: Home,
      },
      {
        path: routes.journeys,
        Component: MyJourneys,
      },
      {
        path: routes.messages.home,
        children: [
          { index: true, Component: MyMessages },
          {
            path: ':conversationId',
            Component: Conversation,
          },
        ],
      },
      {
        path: routes.settings,
        Component: Settings,
      },
    ],
  },
]);
