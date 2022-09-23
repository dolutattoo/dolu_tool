import { Grid, Stack } from '@mantine/core';
import SelectedLocation from './SelectedLocation';
import LocationPermissions from './LocationPermissions';
import { useSelectedLocation } from '../../../../../atoms/location';

const LocationPapers: React.FC = () => {
  const location = useSelectedLocation();

  return (
    <Grid.Col span={2} sx={{ height: '100%' }}>
      {location !== null && (
        <Stack>
          <SelectedLocation />
          <LocationPermissions />
        </Stack>
      )}
    </Grid.Col>
  );
};

export default LocationPapers;
