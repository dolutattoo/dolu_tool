import { Navbar, Stack } from '@mantine/core'
import { TbHome } from 'react-icons/tb'
import { RiHomeGearFill } from 'react-icons/ri'
import { FaCar, FaTshirt } from 'react-icons/fa'
import { BiCube, BiWorld } from 'react-icons/bi'
import NavIcon from './NavIcon'
import { GiTeleport } from 'react-icons/gi'
import { fetchNui } from '../../../utils/fetchNui'

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
          <NavIcon color="blue.4" tooltip="Home" Icon={TbHome} to="/" handleClick={() => fetchNui('dmt:tabSelected', 'home')} />
          <NavIcon color="blue.4" tooltip="World" Icon={BiWorld} to="/world" handleClick={() => fetchNui('dmt:tabSelected', 'world')} />
          <NavIcon color="blue.4" tooltip="Locations" Icon={GiTeleport} to="/locations"  handleClick={() => fetchNui('dmt:tabSelected', 'locations')}/>
          <NavIcon color="blue.4" tooltip="Interior" Icon={RiHomeGearFill} to="/interior"  handleClick={() => fetchNui('dmt:tabSelected', 'interior')}/>
          <NavIcon color="blue.4" tooltip="Object" Icon={BiCube} to="/object"  handleClick={() => fetchNui('dmt:tabSelected', 'object')}/>
          <NavIcon color="blue.4" tooltip="Ped" Icon={FaTshirt} to="/ped"  handleClick={() => fetchNui('dmt:tabSelected', 'ped')}/>
          <NavIcon color="blue.4" tooltip="Vehicle" Icon={FaCar} to="/vehicle"  handleClick={() => fetchNui('dmt:tabSelected', 'vehicle')}/>
        </Stack>
      </Navbar.Section>
    </Navbar>
  )
}

export default Nav
