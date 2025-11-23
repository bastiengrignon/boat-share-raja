import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

const Home = lazy(() => import('./pages/Home'));
const Layout = lazy(() => import('./layout/Layout'));

interface Routes {
  home: string;
}

export const routes: Routes = {
  home: '/',
};

export const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: routes.home,
        element: <Home />,
      },
    ],
  },
]);
