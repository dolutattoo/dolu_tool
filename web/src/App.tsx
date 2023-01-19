import { Box, createStyles } from '@mantine/core'
import { ThreeComponent } from './layouts/gizmo/ThreeComponent'
import ImgPreview from './layouts/imgPreview'
import Menu from './layouts/menu'

const useStyles = createStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}))

const App: React.FC = () => {
  const { classes } = useStyles()  

  return (
    <>
      <Box className={classes.container}>
        <Menu />
        <ThreeComponent />
      </Box>
      <ImgPreview />
    </>
  )
}

export default App
