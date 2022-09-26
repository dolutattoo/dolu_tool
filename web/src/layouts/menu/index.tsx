import { AppShell, Box, createStyles, Group, Header, Title, Transition } from '@mantine/core'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './views/home'
import { menuVisibilityAtom } from '../../atoms/visibility'
import { useNuiEvent } from '../../hooks/useNuiEvent'
import { useExitListener } from '../../hooks/useExitListener'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Location, locationsAtom } from '../../atoms/location'
import Interior from './views/interior'
import Locations from './views/locations'
import { interiorAtom, InteriorData } from '../../atoms/interior'
import NavIcon from './components/NavIcon'
import { TbLogout } from 'react-icons/tb'
import { fetchNui } from '../../utils/fetchNui'

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: 1280,
    height: 768,
    color: theme.colors.dark[1],
  },
}))

const Menu: React.FC = () => {
  const { classes } = useStyles()
  const [visible, setVisible] = useRecoilState(menuVisibilityAtom)
  const setLocations = useSetRecoilState(locationsAtom)
  const setInteriorData = useSetRecoilState(interiorAtom)

  useNuiEvent('setMenuVisible', (data: Location) => {
    setVisible(true)
    setLocations(data)
  })

  useNuiEvent('setLocationDatas', (data: Location) => {
    setLocations(data)
  })

  useNuiEvent('setIntData', (data: InteriorData) => {
    setInteriorData(data)
  })

  useExitListener(setVisible)

  return (
    <Transition transition="slide-right" mounted={visible}>
      {(style) => (
        <Box sx={{ position: 'absolute', top: '2%', left: '2%' }} style={style} className={classes.wrapper}>
          <AppShell
            padding="md"
            fixed={false}
            styles={(theme) => ({
              root: {
                maxWidth: 600,
              },
              main: {
                backgroundColor: theme.colors.dark[8],
                width: 1024,
                height: 768,
                maxWidth: 600,
                borderBottomLeftRadius: theme.radius.sm,
                borderBottomRightRadius: theme.radius.sm,
              },
            })}
            navbar={<Nav />}
            header={
              <Header sx={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }} height={60}>
                <Group sx={{ height: '100%' }} px={20} position='apart'>
                  <Title order={3}>Dolu Mapping Tool v4</Title>
                  <NavIcon tooltip="Exit" Icon={TbLogout} color="red.4" to="" handleClick={() => {setVisible(false); fetchNui('exit')}} />
                </Group>
              </Header>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/interior" element={<Interior />} />
            </Routes>
          </AppShell>
        </Box>
      )}
    </Transition>
  )
}

export default Menu
