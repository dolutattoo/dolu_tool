import { AppShell, Box, createStyles, Group, Header, Title, Transition } from '@mantine/core'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './views/home'
import { menuVisibilityAtom } from '../../atoms/visibility'
import { useNuiEvent } from '../../hooks/useNuiEvent'
import { useExitListener } from '../../hooks/useExitListener'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Location, locationsAtom, locationsPageCountAtom } from '../../atoms/location'
import Interior from './views/interior'
import Locations from './views/locations'
import { interiorAtom, InteriorData } from '../../atoms/interior'
import NavIcon from './components/NavIcon'
import { TbLogout } from 'react-icons/tb'
import { fetchNui } from '../../utils/fetchNui'
import Ped from './views/ped'
import { pedListAtom, PedProp } from '../../atoms/ped'
import World from './views/world'

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
  const setPedList = useSetRecoilState(pedListAtom)

  useNuiEvent('setMenuVisible', (data: {locations: Location[], pedLists: PedProp[]}) => {
    setVisible(true)
    setLocations(data.locations)
    setPedList(data.pedLists)
  })

  useNuiEvent('setLocationDatas', (data: Location[]) => {
    setLocations(data)
  })

  useNuiEvent('setIntData', (data: InteriorData) => {
    setInteriorData(data)
  })

  useExitListener(setVisible)

  return (
    <Transition transition="slide-right" mounted={visible}>
      {(style) => (
        <Box sx={{ position: 'absolute', top: '2%', left: '1.5%' }} style={style} className={classes.wrapper}>
          <AppShell
            padding="md"
            fixed={false}
            styles={(theme) => ({
              root: {
                maxWidth: 600,
              },
              main: {
                backgroundColor: 'rgba(24, 24, 27, 0.99)', // backgroundColor: theme.colors.dark[8],
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
                  <NavIcon tooltip="Exit" Icon={TbLogout} color="red.4" to="" handleClick={() => {setVisible(false); fetchNui('dmt:exit')}} />
                </Group>
              </Header>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/world" element={<World />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/interior" element={<Interior />} />
              <Route path="/ped" element={<Ped />} />
            </Routes>
          </AppShell>
        </Box>
      )}
    </Transition>
  )
}

export default Menu
