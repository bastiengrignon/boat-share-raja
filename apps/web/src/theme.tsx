import { createTheme, Paper } from '@mantine/core';

export const theme = createTheme({
  cursorType: 'pointer',
  primaryColor: 'cyan',
  primaryShade: 7,
  components: {
    Paper: Paper.extend({
      defaultProps: {
        shadow: 'md',
      },
    }),
  },
});
