import { Text, Stack, SimpleGrid, Paper, Group, Select, Tooltip } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { TiWeatherPartlySunny } from 'react-icons/ti'
import { fetchNui } from '../../../../utils/fetchNui'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import { useRecoilState } from 'recoil'
import { worldClockAtom, worldWeatherAtom } from '../../../../atoms/world'

const World: React.FC = () => {
  const [clockValue, setClockValue] = useRecoilState(worldClockAtom)
  const [weatherValue, setWeatherValue] = useRecoilState(worldWeatherAtom)

  useNuiEvent('setWorldData', (data: any) => {
    setWeatherValue(data.weather)
  })

  return (
    <SimpleGrid cols={1}>
      <Stack>     
        {/* Time    */}
        <Paper p="md">  
          <Group position="apart">
            <Text size={20} weight={600}>Time</Text>
            <AiOutlineClockCircle size={24} />
          </Group>
            
          <TimeInput
            label="What time is it now?"
            value={new Date(clockValue)}
            onChange={() => fetchNui('dmt:setClock', clockValue)}
            rightSection={
              <Tooltip label="Select and use your keyboard arrows to set time easier!" position="right">
                <Text color="blue.4">?</Text>
              </Tooltip>}
          />
        </Paper>

        {/* Weather */}
        <Paper p="md">
          <Group position="apart">
            <Text size={20} weight={600}>Weather</Text>
            <TiWeatherPartlySunny size={24} />
          </Group>

          <Select
            label="Choose a weather type"
            placeholder="Current weather?"
            defaultValue={weatherValue}
            value={weatherValue}
            onChange={(value) => {
              value && setWeatherValue(value)
              fetchNui('dmt:setWeather', value)
            }}
            data={[
              { value: 'clear', label: "Clear" },
              { value: 'extraSunny', label: "ExtraSunny" },
              { value: 'neutral', label: "Neutral" },
              { value: 'smog', label: "Smog" },
              { value: 'foggy', label: "Foggy" },
              { value: 'overcast', label: "Overcast" },
              { value: 'clouds', label: "Clouds" },
              { value: 'clearing', label: "Clearing" },
              { value: 'rain', label: "Rain" },
              { value: 'thunder', label: "Thunder" },
              { value: 'snow', label: "Snow" },
              { value: 'blizzard', label: "Blizzard" },
              { value: 'snowlight', label: "Snowlight" },
              { value: 'xmas', label: "Xmas" },
              { value: 'halloween', label: "Halloween" },
            ]}
          />
        </Paper>
      </Stack>
    </SimpleGrid>
  )
}

export default World