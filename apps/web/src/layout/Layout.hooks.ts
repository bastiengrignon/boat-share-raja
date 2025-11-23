import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { authClient } from '../lib/auth-client';
import { useSession } from '../lib/useSession';
import { routes } from '../router';

export const useLayoutHooks = () => {
  const navigate = useNavigate();
  const { session, user, isPending } = useSession();
  const { mutate: signOutMutation, isPending: signOutLoading } = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: () => navigate(routes.login),
  });

  useEffect(() => {
    if (!isPending && !session) {
      navigate(routes.login);
    }
  }, [session, isPending, navigate]);

  return {
    session,
    user,
    isPending,
    signOutLoading,
    handleLogout: () => signOutMutation(),
  };
};
