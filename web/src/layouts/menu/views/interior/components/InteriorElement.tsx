import { useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { Text, Paper, Group, Checkbox, Space, NumberInput, NumberInputHandlers, ActionIcon } from "@mantine/core"
import { getInteriorData, portalDataAtom, portalDebuggingAtom, portalEditingIndexAtom } from "../../../../../atoms/interior"
import { fetchNui } from "../../../../../utils/fetchNui"

const InteriorElement: React.FC = () => {
  const interior = getInteriorData()
  const [portalEditingIndex, setPortalEditingIndex] = useRecoilState(portalEditingIndexAtom)
  const handlers = useRef<NumberInputHandlers>()
  const [portalData, setPortalData] = useRecoilState(portalDataAtom)

  const [checkboxesValue, setCheckboxesValue] = useRecoilState(portalDebuggingAtom)
  useEffect(() => {
    if (checkboxesValue) fetchNui('dmt:setPortalCheckbox', checkboxesValue)
  }, [checkboxesValue, setCheckboxesValue])
  
  return (
    <>
      {/* Current interior infos */}
      <Paper p="md">
        <Text size={24} weight={600}>Current interior</Text>
        <Space h="xs" />
        <Group><Text>Interior ID:</Text><Text color="blue.4" > { interior.interiorId }</Text></Group>
        <Group><Text>Room count:</Text><Text color="blue.4" > { interior.roomCount }</Text></Group>
        <Group><Text>Portal count:</Text><Text color="blue.4" > { interior.portalCount }</Text></Group>
        <Group><Text>Current room:</Text><Text color="blue.4" > { interior.currentRoom?.index } - { interior.currentRoom?.name }</Text></Group>
      </Paper>

      {/* Portal drawing */}
      <Paper p="md">
        <Text size={24} weight={600}>Portals</Text>
        
        <Checkbox.Group
          orientation='horizontal'
          spacing="xs"
          size="md"
          value={checkboxesValue}
          onChange={setCheckboxesValue}
        >
          <Checkbox color="blue.4" value="portalInfos" label="Infos" />
          <Checkbox color="blue.4" value="portalPoly" label="Fill portals" />
          <Checkbox color="blue.4" value="portalLines" label="Outline" />
          <Checkbox color="blue.4" value="portalCorners" label="Corners" />
        </Checkbox.Group>

        <Space h="sm" />
        
        <Text size={16} weight={400}>Edit portal</Text>

        <Group>
          {/* PORTAL INDEX INPUT */}
          <Group spacing={5}>
            <ActionIcon size={36} variant="default" onClick={() => handlers.current?.decrement()}>
              –
            </ActionIcon>

            <NumberInput
              hideControls
              value={portalEditingIndex}
              handlersRef={handlers}
              max={interior.portalCount && interior.portalCount-1}
              min={0}
              step={1}
              onChange={(val) => {val && setPortalEditingIndex(val); setPortalData(interior.portals![val!])}}
              styles={{ input: { width: 58, textAlign: 'center' } }}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
              formatter={(value) =>
                !Number.isNaN(value && parseFloat(value))
                  ? `ID ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : 'ID '
              }
            />

            <ActionIcon size={36} variant="default" onClick={() => handlers.current?.increment()}>
              +
            </ActionIcon>
          </Group>
          { portalData && <Group position="apart">
            <Text size={16} weight={600}>Flag: {portalData? portalData.flag : 'null'}</Text>
            <Text size={16} weight={600}>, Room from: {portalData? portalData.roomFrom : 'null'}</Text>
            <Text size={16} weight={600}>, Room to: {portalData? portalData.roomTo : 'null'}</Text>
          </Group> }
        </Group>
      </Paper>
    </>
    )
  }
  
  export default InteriorElement