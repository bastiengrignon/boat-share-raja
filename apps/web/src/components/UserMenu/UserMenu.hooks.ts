import { useAuthSession } from '../../lib/useSession';

export const useUserMenuHooks = () => {
  const { user } = useAuthSession();

  return {
    user,
  };
};
