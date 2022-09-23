import { Box, Button, createStyles, Grid, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import { openModal } from '@mantine/modals';
import CreateLocation from './modals/CreateLocation';
import { selectedLocationIdAtom, useLocation } from '../../../../../atoms/location';
import { useSetRecoilState } from 'recoil';
import { TbList } from 'react-icons/tb';
import HeaderGroup from '../../../components/HeaderGroup';
import LocationSearch from './LocationSearch';

const useStyles = createStyles((theme) => ({
  location: {
    backgroundColor: theme.colors.dark[6],
    borderRadius: theme.radius.sm,
    padding: 12,
    boxShadow: theme.shadows.sm,
    width: 345,

    '&:hover': {
      backgroundColor: theme.colors.dark[5],
    },
  },
}));

const LocationList: React.FC = () => {
  const { classes } = useStyles();
  const locations = useLocation();
  const setSelectedLocationIndex = useSetRecoilState(selectedLocationIdAtom);

  return (
    <Grid.Col span={1}>
      <Paper p="md">
        <Stack>
          <HeaderGroup header="Existing Locations" Icon={TbList} />
          <LocationSearch />
          <Button
            uppercase
            variant="light"
            onClick={() =>
              openModal({
                title: 'Create location',
                size: 'xs',
                children: <CreateLocation />,
              })
            }
          >
            Create location
          </Button>
          <ScrollArea style={{ height: 555 }} scrollbarSize={0}>
            <Stack>
              {locations.map((location, index) => (
                <Box
                  className={classes.location}
                  key={`location-${index}`}
                  onClick={() => setSelectedLocationIndex(location.name)}
                >
                  <Stack spacing="xl">
                    <Stack spacing={0}>
                      <Text size="xl">{location.name}</Text>
                      <Text size="xs">
                        Coords: {location.x}, {location.y}, {location.z}
                      </Text>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </ScrollArea>
        </Stack>
      </Paper>
    </Grid.Col>
  );
};

export default LocationList;
