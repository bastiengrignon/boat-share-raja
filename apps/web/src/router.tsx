import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
const Layout = lazy(() => import('./layout/Layout'));

interface Routes {
  home: string;
  login: string;
  signup: string;
  settings: string;
  forgotPassword: string;
  resetPassword: string;
}

export const routes: Routes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  settings: '/settings',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
};

export const router = createBrowserRouter([
  {
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: routes.home,
        element: <Home />,
      },
      {
        path: routes.settings,
        element: <Settings />,
      },
    ],
  },
  {
    path: routes.login,
    element: <Login />,
  },
  {
    path: routes.signup,
    element: <SignUp />,
  },
  {
    path: routes.forgotPassword,
    element: <ForgotPassword />,
  },
  {
    path: routes.resetPassword,
    element: <ResetPassword />,
  },
]);
