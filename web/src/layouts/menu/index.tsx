import { AppShell, Box, createStyles, Group, Header, Title, Transition } from '@mantine/core'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Route, Routes } from 'react-router-dom'
import { TbLogout } from 'react-icons/tb'
import { fetchNui } from '../../utils/fetchNui'
import { useNuiEvent } from '../../hooks/useNuiEvent'
import { useExitListener } from '../../hooks/useExitListener'
import { menuVisibilityAtom } from '../../atoms/visibility'
import { interiorAtom, InteriorData } from '../../atoms/interior'
import { lastLocationsAtom, Location } from '../../atoms/location'
import { positionAtom } from '../../atoms/position'
import Nav from './components/Nav'
import NavIcon from './components/NavIcon'
import Home from './views/home'
import World from './views/world'
import Interior from './views/interior'
import Object from './views/object'
import Locations from './views/locations'
import Ped from './views/ped'
import Vehicle from './views/vehicle'
import Weapon from './views/weapon'
import { useLocales } from '../../providers/LocaleProvider'

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: 600,
    height: 775,
    color: theme.colors.dark[1],
  },
}))

const Menu: React.FC = () => {
  const { locale } = useLocales()
  const { classes } = useStyles()
  const [visible, setVisible] = useRecoilState(menuVisibilityAtom)
  const setInteriorData = useSetRecoilState(interiorAtom)
  const setLastLocation = useSetRecoilState(lastLocationsAtom)
  const setPosition = useSetRecoilState(positionAtom)

  useNuiEvent('setMenuVisible', (data: {lastLocation: Location, position: string}) => {   
    setVisible(true)
    setLastLocation(data.lastLocation)
    setPosition(data.position)
  })

  useNuiEvent('setLastLocation', (data: Location) => {
    setLastLocation(data)
  })

  useNuiEvent('setIntData', (data: InteriorData) => {
    setInteriorData(data)
  })

  useExitListener(setVisible)

  return (
    <Transition duration={100} transition="slide-right" mounted={visible}>
      {(style) => (
        <Box sx={{ position: 'absolute', top: '2%', left: '1.5%', zIndex: 3 }} style={style} className={classes.wrapper}>
          <AppShell
            padding="md"
            fixed={false}
            navbar={<Nav />}
            header={
              <Header sx={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} height={60}>
                <Group px={20} position='apart'>
                  <Title order={3}>Dolu Tool v4</Title>
                  <NavIcon tooltip={locale.ui_exit} Icon={TbLogout} color='red.4' to='' handleClick={() => {setVisible(false); fetchNui('dolu_tool:exit')}} />
                </Group>
              </Header>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/world" element={<World />} />
              <Route path="/interior" element={<Interior />} />
              <Route path="/object" element={<Object />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/ped" element={<Ped />} />
              <Route path="/vehicle" element={<Vehicle />} />
              <Route path="/weapon" element={<Weapon />} />
            </Routes>
          </AppShell>
        </Box>
      )}
    </Transition>
  )
}

export default Menu
