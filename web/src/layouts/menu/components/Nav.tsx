import { Navbar, Stack } from '@mantine/core';
import { TbHome, TbLogout } from 'react-icons/tb';
import { RiHomeGearFill } from 'react-icons/ri';
import NavIcon from './NavIcon';
import { menuVisibilityAtom } from '../../../atoms/visibility';
import { useSetRecoilState } from 'recoil';
import { GiTeleport } from 'react-icons/gi';

const Nav: React.FC = () => {
  const setVisible = useSetRecoilState(menuVisibilityAtom);

  return (
    <Navbar
      width={{ base: 80 }}
      p="md"
      fixed={false}
      sx={(theme) => ({
        height: 768,
        borderTopLeftRadius: theme.radius.sm,
        borderBottomLeftRadius: theme.radius.sm,
      })}
    >
      <Navbar.Section grow>
        <Stack justify="center" spacing={5}>
          <NavIcon color='orange' tooltip="Home" Icon={TbHome} to="/" />
          <NavIcon color='orange' tooltip="Locations" Icon={GiTeleport} to="/locations" />
          <NavIcon color='orange' tooltip="Interior" Icon={RiHomeGearFill} to="/interior" />
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center">
          <NavIcon tooltip="Exit" Icon={TbLogout} color="red.4" to="" handleClick={() => setVisible(false)} />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default Nav;
