import { Button, Paper, Stack, Text } from '@mantine/core';
import { useSelectedLocation } from '../../../../../atoms/location';
import HeaderGroup from '../../../components/HeaderGroup';
import { TbUsers } from 'react-icons/tb';

const LocationPermissions: React.FC = () => {
  const location = useSelectedLocation();

  return (
    <>
      {location !== null && (
        <>
          {location.type === 'group' ||
            (location.type === 'shared' && (
              <Paper p="md">
                <Stack>
                  <HeaderGroup header="Location Permissions" Icon={TbUsers} />
                  <Button uppercase>Manage location permissions</Button>
                </Stack>
              </Paper>
            ))}
        </>
      )}
    </>
  );
};

export default LocationPermissions;
