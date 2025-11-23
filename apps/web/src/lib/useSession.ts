import { authClient, type Session, type User } from './auth-client';

type SessionHookProp = {
  isPending: boolean;
  session: Session | null;
  user: User | null;
  error: Error | null;
};

export const useSession = (): SessionHookProp => {
  const { data: session, isPending, error } = authClient.useSession();
  return {
    session: session?.session || null,
    user: session?.user || null,
    isPending,
    error,
  };
};
