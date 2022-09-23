import { Box, Button, createStyles, Group, Paper, Stack, Text } from '@mantine/core';
import { teleportToLocation, useSelectedLocation } from '../../../../../atoms/location';
import HeaderGroup from '../../../components/HeaderGroup';
import { TbCreditCard } from 'react-icons/tb';
import { openModal } from '@mantine/modals';
import RenameLocation from './modals/RenameLocation';
import { useEffect, useState } from 'react';
import { setClipboard } from '../../../../../utils/setClipboard';

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

const SelectedLocation: React.FC = () => {
  const { classes } = useStyles();
  const location = useSelectedLocation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (copied) setCopied(false);
    }, 2000);
  }, [copied, setCopied]);

  return (
    <>
      {location !== null && (
        <Paper p="md">
          <Group>
            <Stack sx={{ width: '100%' }}>
              <HeaderGroup header="Selected Location" Icon={TbCreditCard} />
              <Group>
                <Box className={classes.location}>
                  <Stack spacing="xl">
                    <Stack spacing={0}>
                      <Text size="xl">{location.name}</Text>
                      <Text size="xs">
                        Location
                      </Text>
                    </Stack>
                    <Group position="apart">
                      <Text>{location.name}</Text>
                    </Group>
                  </Stack>
                </Box>
                <Stack spacing="sm" sx={{ width: 250 }}>
                  <Button
                    uppercase
                    variant="outline"
                    onClick={() => {
                      teleportToLocation({ x: location.x, y: location.y, z: location.z, heading: location.heading })
                    }}
                  >
                    Teleport to location
                  </Button>
                  <Button
                    uppercase
                    variant="outline"
                    onClick={() => {
                      openModal({
                        title: 'Rename location',
                        children: <RenameLocation />,
                        size: 'xs',
                      });
                    }}
                  >
                    Rename location
                  </Button>
                  <Button
                    uppercase
                    variant="outline"
                    color={copied ? 'teal' : 'blue'}
                    onClick={() => {
                      setClipboard(location.x + ', ' + location.y + ', ' + location.z);
                      setCopied(true);
                    }}
                  >
                    {copied ? 'Copied' : 'Copy'} coordinates
                  </Button>
                </Stack>
              </Group>
            </Stack>
          </Group>
        </Paper>
      )}
    </>
  );
};

export default SelectedLocation;
