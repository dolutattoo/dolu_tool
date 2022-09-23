import { Grid } from '@mantine/core';
import LocationList from './components/LocationList';
import LoctionPapers from './components/LocationPapers';

const Locations: React.FC = () => {
  return (
    <Grid sx={{ height: '100%' }} columns={3}>
      <LocationList />
      <LoctionPapers />
    </Grid>
  );
};

export default Locations;
