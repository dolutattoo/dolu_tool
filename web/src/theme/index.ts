import { MantineThemeOverride } from '@mantine/core';

export const customTheme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  components: {
    Paper: {
      defaultProps: {
        style: { border: '#25262B 1px solid' },
      },
    },
  },
};
