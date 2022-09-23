import { Box, createStyles } from '@mantine/core';
import Menu from './layouts/menu';

const useStyles = createStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const App: React.FC = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Menu />
    </Box>
  );
};

export default App;
