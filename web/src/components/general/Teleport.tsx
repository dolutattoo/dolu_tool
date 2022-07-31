import { useState } from "react"
import { ActionIcon, Button, Divider, Group, NativeSelect, Space, TextInput } from "@mantine/core"
import { Check, ChevronDown, X } from "tabler-icons-react"
import { useNuiEvent } from "../../hooks/useNuiEvent"
import { fetchNui } from "../../utils/fetchNui"

const Teleport = () => {

  // TP Coords
  const [coords, setCoords] = useState<string>('0, 0, 0')
  const tpCoords = (coords: any) => {
    fetch(`https://DoluMappingTool/dmt:teleport:tpCoords`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: JSON.stringify(coords)
    }).then(resp => resp.json())
  }

  // TP Marker
  const tpMarker = () => {
    fetch(`https://DoluMappingTool/dmt:teleport:tpMarker`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=UTF-8'}
      // No body needed
    }).then(resp => resp.json())
  }

  // Get ped coords
  const getCoords = () => {
    fetch(`https://DoluMappingTool/dmt:teleport:getCoords`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=UTF-8'}
      // No body needed
    }).then(resp => resp.json()).then(resp => { setCoords(resp.coords) })
  }

  const [currentCoords, getCurrentCoords] = useState<any>('0, 0, 0')
  useNuiEvent('getCurrentCoords', getCurrentCoords)

  // Teleport List
  const [positionSelect, setPositionSelect] = useState<any>('')
  const [positionsData, setPositionsData] = useState<[]>([])
  // Init Positions List
  useNuiEvent('dmt:teleport:setPositionData', setPositionsData)

  // Save new positions
  const [positionName, setPositionName] = useState<any>('')
  const savePositions = () => {
    fetchNui('dmt:teleport:savePosition', positionName)
  }

  // Teleport to selected position
  const tpPos = () => {
    fetchNui('dmt:teleport:tpList', positionSelect)
  }

  // Remove selected position
  const removePos = () => {
    fetchNui('dmt:teleport:removeList', positionSelect)
  }

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
          onClick={() => setCoords('0, 0, 0')}
          size="xs"
        >
          Reset
        </Button>
      </Group>

      <Divider my="xs" label="Teleport List" labelPosition="center" />

      <Group position='apart'>
        <NativeSelect 
          value = {positionSelect}
          onChange={(event) => {setPositionSelect(event.currentTarget.value)}}
          placeholder='Select a position'
          rightSection={<ChevronDown size={14} color={'white'} />}
          rightSectionWidth={40}
          data={positionsData}
        />
        <ActionIcon
        onClick={tpPos}
        >
          <Check/>
        </ActionIcon>
        <ActionIcon
        onClick={removePos}
        >
          <X/>
        </ActionIcon>
      </Group>

      <Divider my="xs" label="Save Position" labelPosition="center" />

      <Group position='apart'>
        <TextInput  variant="filled" placeholder="Position Name" value={positionName} onChange={(event) => setPositionName(event.currentTarget.value)} rightSection={"?"} />
        <ActionIcon
          onClick={savePositions}
        >
          <Check/>
        </ActionIcon>
      </Group>
    </>
  )
}

export default Teleport