import { MantineThemeOverride } from '@mantine/core'

const radius = '10px'
const mainBackgroundColor = 'rgba(24, 24, 27, 0.95)'

export const customTheme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  shadows: { sm: '1px 1px 3px rgba(0, 0, 0, 0.5)' },
  components: {
    Header: {
      styles: {
        root: {
          height: '100%',
          backgroundColor: mainBackgroundColor,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius
        }
      }
    },
    AppShell: {
      styles: {
        main: {
          backgroundColor: mainBackgroundColor,
          borderBottomRightRadius: radius
        }
      }
    },
    Navbar: {
      styles: {
        root: {
          backgroundColor: mainBackgroundColor,
          borderBottomLeftRadius: radius,
        }
      }
    },
    Paper: {
      styles: {
        root: {
          backgroundColor: 'rgba(24, 24, 27, 0.8)',
          borderRadius: '5px',
        }
      }
    },
    Carousel: {
      styles: {
        root: {
          backgroundColor: 'rgba(24, 24, 27, 0.8)',
          borderRadius: '5px',
        }
      }
    }
  }
}