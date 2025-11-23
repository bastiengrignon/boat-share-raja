import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useSession } from '../lib/useSession';
import { routes } from '../router';

export const useAuthLayoutHooks = () => {
  const navigate = useNavigate();
  const { session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      navigate(routes.home);
    }
  }, [session, isPending, navigate]);
};
