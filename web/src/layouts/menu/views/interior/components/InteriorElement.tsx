import { useEffect, useRef } from "react"
import { useRecoilState } from "recoil"
import { Text, Paper, Group, Checkbox, Space, NumberInput, NumberInputHandlers, ActionIcon, Popover } from "@mantine/core"
import { getInteriorData, portalDataAtom, portalDebuggingAtom, portalEditingIndexAtom, portalFlagsAtom } from "../../../../../atoms/interior"
import { fetchNui } from "../../../../../utils/fetchNui"
import { AiFillEdit } from "react-icons/ai"

const InteriorElement: React.FC = () => {
  const interior = getInteriorData()
  const [portalEditingIndex, setPortalEditingIndex] = useRecoilState(portalEditingIndexAtom)
  const handlers = useRef<NumberInputHandlers>()
  const [portalData, setPortalData] = useRecoilState(portalDataAtom)

  useEffect(() => {
    setPortalFlagCheckboxesValue(interior.portals![portalEditingIndex].flags.list)
    setPortalData(interior.portals![portalEditingIndex])
  }, [interior])

  const [portalDebugCheckboxesValue, setPortalDebugCheckboxesValue] = useRecoilState(portalDebuggingAtom)
  useEffect(() => {
    if (portalDebugCheckboxesValue) fetchNui('dmt:setPortalCheckbox', portalDebugCheckboxesValue)
  }, [portalDebugCheckboxesValue])

  const [portalFlagCheckboxesValue, setPortalFlagCheckboxesValue] = useRecoilState(portalFlagsAtom)

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
          value={portalDebugCheckboxesValue}
          onChange={setPortalDebugCheckboxesValue}
        >
          <Checkbox color="blue.4" value="portalInfos" label="Infos" />
          <Checkbox color="blue.4" value="portalPoly" label="Fill portals" />
          <Checkbox color="blue.4" value="portalLines" label="Outline" />
          <Checkbox color="blue.4" value="portalCorners" label="Corners" />
        </Checkbox.Group>

        <Space h="sm" />
      
        <Paper p="md">
          {/* PORTAL INDEX INPUT */}
          <Group spacing={5}>
            <ActionIcon size={36} variant="default" onClick={() => {handlers.current?.decrement();}}>
              –
            </ActionIcon>

            <NumberInput
              hideControls
              value={portalEditingIndex}
              handlersRef={handlers}
              max={interior.portalCount && interior.portalCount-1}
              min={0}
              step={1}
              onChange={(val) => {val !== undefined &&
                setPortalEditingIndex(val);
                setPortalFlagCheckboxesValue(interior.portals![val!].flags.list);
                setPortalData(interior.portals![val!])
              }}
              styles={{ input: { width: 58, textAlign: 'center' } }}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
              formatter={(value) =>
                !Number.isNaN(value && parseFloat(value))
                  ? `ID ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : 'ID '
              }
            />

            <ActionIcon size={36} variant="default" onClick={() => {handlers.current?.increment()}}>
              +
            </ActionIcon>
          </Group>
          <Space h="sm" />
          {
            portalData && <>
              <Group>
                <Text size={16} weight={600}>
                  Flag:
                </Text>
                <Text size={16} weight={600} color="blue.4">
                  {/* {portalData ? getFlag() : 'null'} */}
                  {portalData ? portalData.flags.total : 'null'}
                </Text>
                
                <Popover position="right-start" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon size="md" variant="default">
                      <AiFillEdit fontSize={20}/>
                    </ActionIcon>
                  </Popover.Target>

                  <Popover.Dropdown>
                    <Checkbox.Group
                      orientation='vertical'
                      spacing="xs"
                      size="sm"
                      value={portalFlagCheckboxesValue!}
                      onChange={(v) => {setPortalFlagCheckboxesValue(v); fetchNui('dmt:setPortalFlagCheckbox', { flags: v, portalIndex: portalEditingIndex })}}
                    >
                      <Checkbox color="blue.4" value="1" label="1 - Disables exterior rendering" />
                      <Checkbox color="blue.4" value="2" label="2 - Disables interior rendering" />
                      <Checkbox color="blue.4" value="4" label="4 - Mirror" />
                      <Checkbox color="blue.4" value="8" label="8 - Extra bloom" />
                      <Checkbox color="blue.4" value="16" label="16 - Unknown 5" />
                      <Checkbox color="blue.4" value="32" label="32 - Use exterior LOD" />
                      <Checkbox color="blue.4" value="64" label="64 - Hide when door closed" />
                      <Checkbox color="blue.4" value="128" label="128 - Unknown 8" />
                      <Checkbox color="blue.4" value="256" label="256 - Mirror exterior portals" />
                      <Checkbox color="blue.4" value="512" label="512 - Unknown 10" />
                      <Checkbox color="blue.4" value="1024" label="1024 - Mirror limbo entities" />
                      <Checkbox color="blue.4" value="2048" label="2048 - Unknown 12" />
                      <Checkbox color="blue.4" value="4096" label="4096 - Unknown 13" />
                      <Checkbox color="blue.4" value="8192" label="8192 - Disable farclipping" />
                    </Checkbox.Group>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              
              <Space h="xs" />

              <Group>
                <Text size={16} weight={600}>
                  Room from:
                </Text>
                <Text size={16} weight={600} color="blue.4">
                  {portalData ? portalData.roomFrom : 'null'}
                </Text>
              </Group>
              
              <Space h="xs" />
              
              <Group>
                <Text size={16} weight={600}>
                  Room to:
                </Text>
                <Text size={16} weight={600} color="blue.4">
                  {portalData ? portalData.roomTo : 'null'}
                </Text>
              </Group>
            </>
          }
        </Paper>
      </Paper>
    </>
    )
  }
  
  export default InteriorElement