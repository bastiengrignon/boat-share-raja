import { matchPath, useLocation } from 'react-router';

import { routes } from '../router';

export const useLayoutHooks = () => {
  const { pathname } = useLocation();
  const match = matchPath(routes.messages.conversation, pathname);

  return {
    isInsideConversation: match !== null,
  };
};
