import { ActionIcon, ThemeIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import type { FC } from 'react';
import { TbMoon, TbSun } from 'react-icons/tb';

import { useMobileQuery } from '../../lib/responsive';

const ColorSwitcher: FC = () => {
  const isMobile = useMobileQuery();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      size={isMobile ? 'md' : 'lg'}
      variant="light"
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
    >
      <ThemeIcon darkHidden variant="transparent">
        <TbSun />
      </ThemeIcon>
      <ThemeIcon lightHidden variant="transparent">
        <TbMoon />
      </ThemeIcon>
    </ActionIcon>
  );
};

export default ColorSwitcher;
