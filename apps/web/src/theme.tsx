import { createTheme, Paper } from '@mantine/core';

export const theme = createTheme({
  cursorType: 'pointer',
  primaryColor: 'blue',
  components: {
    Paper: Paper.extend({
      defaultProps: {
        shadow: 'md',
      },
    }),
  },
});
