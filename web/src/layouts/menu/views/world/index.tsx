import { Text, Stack, SimpleGrid, Paper, Group, Select, NumberInput, Button, Space } from '@mantine/core'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { TiWeatherPartlySunny } from 'react-icons/ti'
import { fetchNui } from '../../../../utils/fetchNui'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import { useRecoilState } from 'recoil'
import { worldHourAtom, worldMinuteAtom, worldWeatherAtom } from '../../../../atoms/world'

const World: React.FC = () => {
  const [hourValue, setHourValue] = useRecoilState(worldHourAtom)
  const [minuteValue, setMinuteValue] = useRecoilState(worldMinuteAtom)
  const [weatherValue, setWeatherValue] = useRecoilState(worldWeatherAtom)

  useNuiEvent('setWorldData', (data: any) => {
    setWeatherValue(data.weather)
    setHourValue(data.clock.hour)
    setMinuteValue(data.clock.minute)
  })

  useNuiEvent('setClockData', (data: any) => {
    setHourValue(data.hour)
    setMinuteValue(data.minute)
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
          
          <Space h="sm" />
            
          <Group grow>
            <NumberInput
              value={hourValue}
              defaultValue={hourValue}
              placeholder={hourValue.toString()}
              radius="md"
              max={24}
              min={0}
              onChange={(value: number) => {
                setHourValue(value)
                fetchNui('dmt:setClock', { hour: value, minute: minuteValue})
              }}
            /> 
            {':'}
            <NumberInput
              value={minuteValue}
              defaultValue={minuteValue}
              radius="md"
              max={60}
              min={0}
              onChange={(value: number) => {
                setMinuteValue(value)
                fetchNui('dmt:setClock', { hour: hourValue, minute: value})
              }}
            />

            <Button
              color='blue.4'
              variant='outline'
              onClick={() => fetchNui('dmt:getClock')}
            >
              Get time
            </Button>
          </Group>
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