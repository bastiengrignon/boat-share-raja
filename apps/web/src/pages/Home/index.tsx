import type { FC } from 'react';

import { useHomeHooks } from './Home.hooks';

const Home: FC = () => {
  useHomeHooks();
  return <div>Blank app</div>;
};

export default Home;
