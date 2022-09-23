import { Grid } from '@mantine/core';
import LocationList from './components/LocationList';
import LoctionPapers from './components/LocationPapers';

export interface Location {
  id: string;
  label: string;
  type: 'personal' | 'group' | 'shared';
  balance: number;
  hasAccess?: boolean;
}

const Locations: React.FC = () => {
  return (
    <Grid sx={{ height: '100%' }} columns={3}>
      <LocationList />
      <LoctionPapers />
    </Grid>
  );
};

export default Locations;
