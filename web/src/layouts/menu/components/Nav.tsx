import { Navbar, Stack } from '@mantine/core'
import { RiHomeGearFill } from 'react-icons/ri'
import { FaCar, FaMapMarkerAlt, FaTshirt } from 'react-icons/fa'
import { BiWorld } from 'react-icons/bi'
import { IoMdCube } from 'react-icons/io'
import NavIcon from './NavIcon'
import { GiPistolGun } from 'react-icons/gi'
import { fetchNui } from '../../../utils/fetchNui'
import { AiFillHome } from 'react-icons/ai'

const Nav: React.FC = () => {

  return (
    <Navbar
      width={{ base: 80 }}
      p="md"
      fixed={false}
      sx={{
        height: 775
      }}
    >
      <Navbar.Section grow>
        <Stack justify="center" spacing={5}>
          <NavIcon color="blue.4" tooltip="Home" Icon={AiFillHome} to="/" handleClick={() => fetchNui('dmt:tabSelected', 'home')} />
          <NavIcon color="blue.4" tooltip="World" Icon={BiWorld} to="/world" handleClick={() => fetchNui('dmt:tabSelected', 'world')} />
          <NavIcon color="blue.4" tooltip="Interior" Icon={RiHomeGearFill} to="/interior"  handleClick={() => fetchNui('dmt:tabSelected', 'interior')}/>
          <NavIcon color="blue.4" tooltip="Object Spawner" Icon={IoMdCube} to="/object"  handleClick={() => fetchNui('dmt:tabSelected', 'object')}/>
          <NavIcon color="blue.4" tooltip="Locations" Icon={FaMapMarkerAlt} to="/locations"  handleClick={() => fetchNui('dmt:tabSelected', 'locations')}/>
          <NavIcon color="blue.4" tooltip="Peds" Icon={FaTshirt} to="/ped"  handleClick={() => {fetchNui('dmt:tabSelected', 'peds')}}/>
          <NavIcon color="blue.4" tooltip="Vehicles" Icon={FaCar} to="/vehicle"  handleClick={() => fetchNui('dmt:tabSelected', 'vehicles')}/>
          <NavIcon color="blue.4" tooltip="Weapons" Icon={GiPistolGun} to="/weapon"  handleClick={() => fetchNui('dmt:tabSelected', 'weapons')}/>
        </Stack>
      </Navbar.Section>
    </Navbar>
  )
}

export default Nav
