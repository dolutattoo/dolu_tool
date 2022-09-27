import { Text, Stack, SimpleGrid, Paper, Group, Select, Tooltip, Button } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { useEffect, useState } from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { TiWeatherPartlySunny } from 'react-icons/ti'
import { fetchNui } from '../../../../utils/fetchNui'
import { TbLogout } from 'react-icons/tb'
import NavIcon from '../../components/NavIcon'
import dayjs from 'dayjs'

const World: React.FC = () => {
  const [weatherValue, setweatherValue] = useState<string|null>(null)
  const [clockValue, setclockValue] = useState(new Date())

  useEffect(() => {
    if (weatherValue) {
      fetchNui('setWeather', weatherValue)
    }
  }, [weatherValue, setweatherValue])

  useEffect(() => {
    if (clockValue) {
      fetchNui('setClock', clockValue)
    }
  }, [clockValue, setclockValue])

  return (
    <SimpleGrid cols={1}>
      <Stack>
        <Text color="blue">TODO</Text>
        
        <Paper p="md">  
          <Group position="apart">
            <Text size={20} weight={600}>Time</Text>
            <AiOutlineClockCircle size={24} />
          </Group>
            
          <TimeInput
            label="What time is it now?"
            value={clockValue}
            onChange={setclockValue}
            rightSection={
              <Tooltip label="Select and use your keyboard arrows to set time easier!" position="right">
                <Text color="blue.4">?</Text>
              </Tooltip>}
          />
        </Paper>

        <Paper p="md">
          <Group position="apart">
            <Text size={20} weight={600}>Weather</Text>
            <TiWeatherPartlySunny size={24} />
          </Group>

          <Select
            label="Choose a weather type"
            placeholder="Current weather?"
            value={weatherValue} onChange={setweatherValue}
            data={[
              { value: 'Clear', label: "Clear" },
              { value: 'ExtraSunny', label: "ExtraSunny" },
              { value: 'Neutral', label: "Neutral" },
              { value: 'Smog', label: "Smog" },
              { value: 'Foggy', label: "Foggy" },
              { value: 'Overcast', label: "Overcast" },
              { value: 'Clouds', label: "Clouds" },
              { value: 'Clearing', label: "Clearing" },
              { value: 'Rain', label: "Rain" },
              { value: 'Thunder', label: "Thunder" },
              { value: 'Snow', label: "Snow" },
              { value: 'Blizzard', label: "Blizzard" },
              { value: 'Snowlight', label: "Snowlight" },
              { value: 'Xmas', label: "Xmas" },
              { value: 'Halloween', label: "Halloween" },
            ]}
          />
        </Paper>
      </Stack>
    </SimpleGrid>
  )
}

export default World