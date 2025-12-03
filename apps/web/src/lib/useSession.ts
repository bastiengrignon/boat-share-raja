import type { User } from '@boat-share-raja/shared-types';

import { authClient, type Session } from './auth-client';

interface AuthSessionHook {
  session: Session | undefined;
  user: User | undefined;
  isPending: boolean;
  error: Error | null;
}

export const useAuthSession = (): AuthSessionHook => {
  const { data, isPending, error } = authClient.useSession();

  return {
    session: data?.session,
    user: data?.user,
    isPending,
    error,
  };
};
