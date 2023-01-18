import { useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { Text, Paper, Group, Checkbox, Space, NumberInput, NumberInputHandlers, ActionIcon, Popover } from '@mantine/core'
import { getInteriorData, portalDataAtom, portalDebuggingAtom, portalEditingIndexAtom, portalFlagsAtom } from '../../../../../atoms/interior'
import { fetchNui } from '../../../../../utils/fetchNui'
import { AiFillEdit } from 'react-icons/ai'
import { useLocales } from '../../../../../providers/LocaleProvider'

const InteriorElement: React.FC = () => {
  const { locale } = useLocales()
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
    if (portalDebugCheckboxesValue) fetchNui('dolu_tool:setPortalCheckbox', portalDebugCheckboxesValue)
  }, [portalDebugCheckboxesValue])

  const [portalFlagCheckboxesValue, setPortalFlagCheckboxesValue] = useRecoilState(portalFlagsAtom)

  return (
    <>
      {/* Current interior infos */}
      <Paper p='md'>
        <Text size={24} weight={600}>Current interior</Text>
        <Space h='xs' />
        <Group><Text>{locale.ui_interior_id}:</Text><Text color='blue.4' > { interior.interiorId }</Text></Group>
        <Group><Text>{locale.ui_current_room}:</Text><Text color='blue.4' > { interior.roomCount }</Text></Group>
        <Group><Text>{locale.ui_portal_count}:</Text><Text color='blue.4' > { interior.portalCount }</Text></Group>
        <Group><Text>{locale.ui_current_room}:</Text><Text color='blue.4' > { interior.currentRoom?.index } - { interior.currentRoom?.name }</Text></Group>
      </Paper>

      {/* Portal drawing */}
      <Paper p='md'>
        <Text size={24} weight={600}>{locale.ui_portals}</Text>
        
        <Checkbox.Group
          orientation='horizontal'
          spacing='xs'
          size='md'
          value={portalDebugCheckboxesValue}
          onChange={setPortalDebugCheckboxesValue}
        >
          <Checkbox color='blue.4' value='portalInfos' label={locale.ui_infos} />
          <Checkbox color='blue.4' value='portalPoly' label={locale.ui_fill_portals} />
          <Checkbox color='blue.4' value='portalLines' label={locale.ui_outline_portals} />
          <Checkbox color='blue.4' value='portalCorners' label={locale.ui_corcers_portals} />
        </Checkbox.Group>

        <Space h='sm' />
      
        <Paper p='md'>
          {/* PORTAL INDEX INPUT */}
          <Group spacing={5}>
            <ActionIcon size={36} variant='default' onClick={() => {handlers.current?.decrement()}}>
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
                setPortalEditingIndex(val)
                setPortalFlagCheckboxesValue(interior.portals![val!].flags.list)
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

            <ActionIcon size={36} variant='default' onClick={() => {handlers.current?.increment()}}>
              +
            </ActionIcon>
          </Group>
          <Space h='sm' />
          {
            portalData && <>
              <Group>
                <Text>{locale.ui_flag}:</Text>
                <Text color='blue.4'>{portalData ? portalData.flags.total : 'Unknown'}</Text>
                
                <Popover position='right-start' withArrow shadow='md'>
                  <Popover.Target>
                    <ActionIcon size='md' variant='default'>
                      <AiFillEdit fontSize={20}/>
                    </ActionIcon>
                  </Popover.Target>

                  <Popover.Dropdown>
                    <Checkbox.Group
                      orientation='vertical'
                      spacing='xs'
                      size='sm'
                      value={portalFlagCheckboxesValue!}
                      onChange={(v) => {
                        setPortalFlagCheckboxesValue(v)
                        fetchNui('dolu_tool:setPortalFlagCheckbox', { flags: v, portalIndex: portalEditingIndex })
                      }}
                    >
                      <Checkbox color='blue.4' value='1' label={"1 - " + locale.ui_portal_flag_1} />
                      <Checkbox color='blue.4' value='2' label={"2 - " + locale.ui_portal_flag_2} />
                      <Checkbox color='blue.4' value='4' label={"4 - " + locale.ui_portal_flag_4} />
                      <Checkbox color='blue.4' value='8' label={"8 - " + locale.ui_portal_flag_8} />
                      <Checkbox color='blue.4' value='16' label={"16 -" + locale.ui_portal_flag_16} />
                      <Checkbox color='blue.4' value='32' label={"32 -" + locale.ui_portal_flag_32} />
                      <Checkbox color='blue.4' value='64' label={"64 -" + locale.ui_portal_flag_64} />
                      <Checkbox color='blue.4' value='128' label={"128 - " + locale.ui_portal_flag_128} />
                      <Checkbox color='blue.4' value='256' label={"256 - " + locale.ui_portal_flag_256} />
                      <Checkbox color='blue.4' value='512' label={"512 - " + locale.ui_portal_flag_512} />
                      <Checkbox color='blue.4' value='1024' label={"1024 - " + locale.ui_portal_flag_1024} />
                      <Checkbox color='blue.4' value='2048' label={"2048 - " + locale.ui_portal_flag_2048} />
                      <Checkbox color='blue.4' value='4096' label={"4096 - " + locale.ui_portal_flag_4096} />
                      <Checkbox color='blue.4' value='8192' label={"8192 - " + locale.ui_portal_flag_8192} />
                    </Checkbox.Group>
                  </Popover.Dropdown>
                </Popover>
              </Group>

              <Group>
                <Text>{locale.ui_room_from}:</Text>
                <Text color='blue.4'>{portalData ? portalData.roomFrom : 'Unknown'}</Text>
              </Group>
              
              <Group>
                <Text>{locale.ui_room_to}:</Text>
                <Text color='blue.4'>{portalData ? portalData.roomTo : 'Unknown'}</Text>
              </Group>
            </>
          }
        </Paper>
      </Paper>
    </>
    )
  }
  
  export default InteriorElement