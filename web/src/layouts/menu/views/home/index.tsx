import { Text, Stack, SimpleGrid, Button, Paper, Group, Space } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { useState } from 'react'
import { GiTeleport } from 'react-icons/gi'
import { ImLocation } from 'react-icons/im'
import { RiHomeGearFill } from 'react-icons/ri'
import { getInteriorData } from '../../../../atoms/interior'
import { getLastLocation } from '../../../../atoms/location'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import { fetchNui } from '../../../../utils/fetchNui'
import CreateLocation from '../locations/components/modals/CreateLocation'

const Home: React.FC = () => {
  const lastLocation = getLastLocation()
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
        {/* Current Coords */}
        <Paper p="md">
          
          <Group position="apart">
            <Text size={20} weight={600}>Current Coords</Text>
            <ImLocation size={24}/>
          </Group>
          
          <Space h="sm" />

          <Group><Text>Coords:</Text><Text color="blue.4" >{currentCoords}</Text></Group>
          
          <Group position='apart'>
            <Group><Text>Heading:</Text><Text color="blue.4" >{currentHeading}</Text></Group>
            <Button
              color='blue.4'
              variant='outline'
              onClick={() =>
              openModal({
                  title: 'Create location',
                  size: 'xs',
                  children: <CreateLocation />,
                })
              }
            >
              Save
            </Button>
          </Group>
    
        </Paper>
        
        {/* Last location */}
        <Paper p="md">
          <Group position="apart">
            <Text size={20} weight={600}>Last location</Text>
            <GiTeleport size={24} />
          </Group>
          
          <Space h="sm" />
          
          {
            lastLocation
            ? 
              <>
                <Group><Text>Name:</Text><Text color="blue.4" >{lastLocation.name}</Text></Group>
                
                <Group position='apart'>
                  <Group><Text>Coords:</Text><Text color="blue.4" >{lastLocation.x}, {lastLocation.y}, {lastLocation.z}</Text></Group>
                  <Button
                    color='blue.4'
                    variant='outline'
                    onClick={() =>
                      fetchNui('dmt:teleport', { name: lastLocation.name, x: lastLocation.x, y: lastLocation.y, z: lastLocation.z, heading: lastLocation.heading })
                    }
                    value={lastLocation.name}
                  >
                    Teleport
                  </Button>
                </Group>
              </>
            :            
              <>
                <Space h="sm" />
                <Text color="red.4">You did not teleport to any location yet.</Text>
              </>
          }
        </Paper>

        {/* Current interior */}
        <Paper p="md">
          <Group position="apart">
            <Text size={20} weight={600}>Current interior</Text>
            <RiHomeGearFill size={24} />
          </Group>
         
          {
            interior.interiorId > 0
            ? 
              <>
                <Group><Text>Interior ID:</Text><Text color="blue.4" >{interior.interiorId}</Text></Group>
                <Group><Text>Current room:</Text><Text color="blue.4" >{interior.currentRoom?.index} - {interior.currentRoom?.name}</Text></Group>
              </>
            : 
              <>
                <Space h="sm" />
                <Text color="red.4">You are not inside any interior.</Text>
              </>
          }
        </Paper>
      </Stack>
    </SimpleGrid>
  )
}

export default Home
