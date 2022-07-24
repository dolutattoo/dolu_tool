import { Accordion, ActionIcon, Checkbox, Divider, Group, NativeSelect, Slider, Space, TextInput, Text } from "@mantine/core"
import { useEffect, useState } from "react";
import { Check, ChevronDown, X } from "tabler-icons-react";
import { fetchNui } from "../../utils/fetchNui";

const World = () => {

  // Time Sliders
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(30);
  useEffect(() => {
    fetch(`https://DoluMappingTool/dmt:world:setTime`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        hour, minute
      })
    }).then(resp => resp.json())
  })

  // Time Freeze CheckBox
  const [freezeTime, setFreezeTime] = useState<boolean>(false);
  useEffect(() => {
    fetch(`https://DoluMappingTool/dmt:world:freezeTime`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        freezeTime
      })
    }).then(resp => resp.json())
  })

  // Weather Selector
  const [weather, setWeather] = useState<any>('');
  useEffect(() =>{
    fetch(`https://DoluMappingTool/dmt:world:setWeather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        weather
      })
    }).then(resp => resp.json())
  })

  return (
    <>
        <Accordion>
          <Accordion.Item label="Time">
            <Group position='left'>
              <Text>Hour : {hour}</Text>
            </Group>
            <Slider
              label={null}
              value={hour}
              onChange={setHour}
              min={0}
              max={23}
              color="orange"
            />
            {/* <Divider my="md"/> */}
            <Space h="md"/>
            <Group position='left'>
              <Text>Minute : {minute}</Text>
            </Group>
            <Slider
              label={null}
              value={minute}
              onChange={setMinute}
              min={0}
              max={59}
              color="orange"
            />
            <Divider my="md"/>
            <Group position='apart'>
              <Text>Freeze Time</Text>
              <Checkbox
              color="orange"
              checked={freezeTime}
              onChange={(event) => {setFreezeTime(event.currentTarget.checked)}}
              />
            </Group>
            </Accordion.Item>
            <Accordion.Item label="Weather">
            <Group position='apart'>
              <Text>Change Weather</Text>
              <NativeSelect
                value={weather}
                onChange={(event) => {setWeather(event.currentTarget.value)}}
                placeholder='Select a weather'
                rightSection={<ChevronDown size={14} color={'white'} />}
                rightSectionWidth={40}
                data={[
                    'ExtraSunny',
                    'Clear',
                    'Neutral',
                    'Smog',
                    'Foggy',
                    'Overcast',
                    'Clouds',
                    'Clearing',
                    'Rain',
                    'Thunder',
                    'Snow',
                    'Blizzard',
                    'Snowlight',
                    'Xmas',
                    'Halloween'
                ]}
              />
            </Group>
          </Accordion.Item>
        </Accordion>
    </>
  )
}

export default World