import type { FC, ReactNode } from 'react';

import { useSession } from '../../lib/useSession';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { session, error } = useSession();

  return !error || session ? children : null;
};

export default PrivateRoute;
