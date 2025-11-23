import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export const useMobileQuery = (breakpoint = 'sm') => {
  const { breakpoints } = useMantineTheme();

  return useMediaQuery(`(max-width: ${breakpoints[breakpoint]})`);
};
