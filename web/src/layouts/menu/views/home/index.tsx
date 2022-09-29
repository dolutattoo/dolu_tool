import { Text, Stack, SimpleGrid, Button, Paper, Group } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { useState } from 'react'
import { GiTeleport } from 'react-icons/gi'
import { ImLocation } from 'react-icons/im'
import { RiHomeGearFill } from 'react-icons/ri'
import { getInteriorData } from '../../../../atoms/interior'
import { getLastLocationUsed, teleportToLocation } from '../../../../atoms/location'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import CreateLocation from '../locations/components/modals/CreateLocation'

const Home: React.FC = () => {
  const location = getLastLocationUsed()
  const interior = getInteriorData()
  const [currentCoords, setCurrentCoords] = useState('1.000, 2.000, 3.000')
  const [currentHeading, setCurrentHeading] = useState('0.000')

  useNuiEvent('playerCoords', (data: { coords: string, heading: string }) => {
    setCurrentCoords(data.coords)
    setCurrentHeading(data.heading)
  })

  return (
    <SimpleGrid cols={1}>
      <Stack>
        <Paper p="md">
          
          <Group position="apart">
            <Text size={20} weight={600}>Current Coords</Text>
            <ImLocation size={24}/>
          </Group>

          <Text>Coords: {currentCoords}</Text>
          
          <Group position='apart'>
            <Text>Heading: {currentHeading}</Text>
            <Button
              color='orange.4'
              variant='outline'
              onClick={() =>
              openModal({
                  title: 'Create location',
                  size: 'xs',
                  children: <CreateLocation />,
                })
              }
              value={location.name}
            >
              Save
            </Button>
          </Group>
    
        </Paper>
          
        <Paper p="md">
          <Group position="apart">
            <Text size={20} weight={600}>Last location</Text>
            <GiTeleport size={24} />
          </Group>

          <Text>Name: {location.name}</Text>
          
          <Group position='apart'>
            <Text>Coords: {location.x}, {location.y}, {location.z}</Text>
            <Button
              color='orange.4'
              variant='outline'
              onClick={() =>
                teleportToLocation({ name: location.name, x: location.x, y: location.y, z: location.z, heading: location.heading })
              }
              value={location.name}
            >
              Teleport
            </Button>
          </Group>
        </Paper>

        <Paper p="md">
          <Group position="apart">
            <Text size={20} weight={600}>Current interior</Text>
            <RiHomeGearFill size={24} />
          </Group>
         
          {
            interior.interiorId > 0
            ? 
              <>
                <Group><Text>Interior ID:</Text><Text color="orange.4" >{interior.interiorId}</Text></Group>
                <Group><Text>Current room:</Text><Text color="orange.4" >{interior.currentRoom?.index} - {interior.currentRoom?.name}</Text></Group>
              </>
            : 
              "Not inside any interior"
          }
        </Paper>
      </Stack>
    </SimpleGrid>
  )
}

export default Home
