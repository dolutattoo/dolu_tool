import { ActionIcon, Button, ColorInput, Divider, Group, Space, Text, TextInput } from "@mantine/core"
import { useState } from "react"
import { BorderAll, Check } from "tabler-icons-react"
import { useNuiEvent } from "../../hooks/useNuiEvent"

const Teleport = () => {
	const [positionName, setPositionName] = useState<string>('')

  // TP Coords
  const [coords, setCoords] = useState<string>('0, 0, 0')
  const tpCoords = (coords: any) => {
    fetch(`https://DoluMappingTool/dmt:character:tpCoords`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: JSON.stringify(coords)
    }).then(resp => resp.json())
  }

  // TP Marker
  const tpMarker = () => {
    fetch(`https://DoluMappingTool/dmt:character:tpMarker`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=UTF-8'}
      // No body needed
    }).then(resp => resp.json())
  }

  // Get ped coords
  const getCoords = () => {
    fetch(`https://DoluMappingTool/dmt:character:getCoords`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=UTF-8'}
      // No body needed
    }).then(resp => resp.json())
  }

  const [currentCoords, getCurrentCoords] = useState<any>('0, 0, 0')
  useNuiEvent('getCurrentCoords', getCurrentCoords)

  return (
    <>
      <Group>
        <TextInput
        variant="unstyled"
          sx={(theme) => ({
            width: "22vw",
            backgroundColor: "rgb(0, 0, 0, 0.25)",
            borderRadius: '0.3vw',
            paddingLeft:'0.3vw',
            paddingRight:'0.3vw',
            borderColor: 'orange',
            outline: "solid rgb(255, 160, 20, 0.8)",
            outlineWidth: "0.1vw"
          })}
          radius="xl"
          color="orange"
          placeholder="0, 0, 0"
          value={coords}
          size="sm"
          onChange={(event) => setCoords(event.currentTarget.value)}
        />
      </Group>

      <Space h="md" />

      <Group>
        <Button
          color="orange"
          variant="outline"
          onClick={() => {tpCoords(coords)}}
          size="xs"
        >
          Go to coords
        </Button>
        <Button
          color="orange"
          variant="outline"
          onClick={() => {tpMarker()}}
          size="xs"
        >
          Go to marker
        </Button>
        <Button
          color="orange"
          variant="outline"
          onClick={() => {getCoords()}}
          size="xs"
        >
          Get ped coords
        </Button>
        <Button
          color="orange"
          variant="outline"
          onClick={() => {tpCoords(coords)}}
          size="xs"
        >
          Reset
        </Button>
      </Group>

      <Divider my="xs" label="Teleport List" labelPosition="center" />

      <Group position='apart'>

      </Group>

      <Divider my="xs" label="Save Position" labelPosition="center" />

      <Group position='apart'>
        <TextInput  variant="filled" placeholder="Position Name" value={positionName} onChange={(event) => setPositionName(event.currentTarget.value)} rightSection={"?"} />
        <ActionIcon>
          <Check/>
        </ActionIcon>
      </Group>
    </>
  )
}

export default Teleport