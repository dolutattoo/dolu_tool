import { ActionIcon, Button, Checkbox, Group, NumberInput, NumberInputHandlers, Paper, Popover, Space, Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useRef, memo } from "react";
import { useRecoilState } from "recoil";
import { AiFillEdit } from "react-icons/ai";
import { FaArrowLeft, FaArrowRight, FaExchangeAlt } from "react-icons/fa";
import { useLocales } from "../../../../../providers/LocaleProvider";
import { getInteriorData, portalDataAtom, portalDebuggingAtom, portalEditingIndexAtom, portalFlagsAtom } from "../../../../../atoms/interior";
import { fetchNui } from "../../../../../utils/fetchNui";

const DebugCheckboxGroup = memo(({ locale, value, onChange }: { locale: any, value: string[], onChange: (value: string[]) => void }) => (
  <Checkbox.Group
    orientation='horizontal'
    spacing='xs'
    size='md'
    value={value}
    onChange={onChange}
  >
    <Checkbox color='blue.4' value='portalInfos' label={locale.ui_infos} />
    <Checkbox color='blue.4' value='portalPoly' label={locale.ui_fill_portals} />
    <Checkbox color='blue.4' value='portalLines' label={locale.ui_outline_portals} />
    <Checkbox color='blue.4' value='portalCorners' label={locale.ui_corcers_portals} />
  </Checkbox.Group>
));

const FlagCheckboxGroup = memo(({ locale, value, onChange, portalEditingIndex }: { 
  locale: any,
  value: string[], 
  onChange: (value: string[]) => void,
  portalEditingIndex: number 
}) => (
  <Checkbox.Group
    orientation='vertical'
    spacing='xs'
    size='sm'
    value={value}
    onChange={(v) => {
      onChange(v);
      fetchNui('dolu_tool:setPortalFlagCheckbox', { flags: v, portalIndex: portalEditingIndex });
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
));

const PortalsElement: React.FC = () => {
  const { locale } = useLocales()
  const interior = getInteriorData()
  const [portalEditingIndex, setPortalEditingIndex] = useRecoilState(portalEditingIndexAtom)
  const handlers = useRef<NumberInputHandlers>()
  const [portalData, setPortalData] = useRecoilState(portalDataAtom)
  const [portalDebugCheckboxesValue, setPortalDebugCheckboxesValue] = useRecoilState(portalDebuggingAtom)
  const [portalFlagCheckboxesValue, setPortalFlagCheckboxesValue] = useRecoilState(portalFlagsAtom)

  useEffect(() => {
    if (interior) {
      if (interior.portalCount && interior.portalCount - 1 < portalEditingIndex) {
        setPortalEditingIndex(0)
      }

      if (interior.portals && interior.portals[portalEditingIndex] !== undefined) {
        setPortalData(interior.portals[portalEditingIndex])
        setPortalFlagCheckboxesValue(interior.portals[portalEditingIndex].flags.list)
      }
    }
  }, [interior])

  useEffect(() => {
    if (portalDebugCheckboxesValue) fetchNui('dolu_tool:setPortalCheckbox', portalDebugCheckboxesValue)
  }, [portalDebugCheckboxesValue])

  const handleFlipPortal = useCallback(() => {
    fetchNui('dolu_tool:flipPortal', { portalIndex: portalEditingIndex })
  }, [portalEditingIndex])

  return (
    <Paper p='md'>
      {interior.portalCount && interior.portalCount > 0 ?
        <>
          <Text size={20} weight={600}>{locale.ui_portals}</Text>

          <DebugCheckboxGroup locale={locale} value={portalDebugCheckboxesValue} onChange={setPortalDebugCheckboxesValue} />

          <Space h='sm' />

          <Paper p='md'>
            {/* PORTAL INDEX INPUT */}
            <Group>
              <Text>{locale.ui_index}:</Text>
              <Group spacing={5}>
                <ActionIcon size={36} variant='default' onClick={() => { handlers.current?.decrement() }}>
                  <FaArrowLeft />
                </ActionIcon>

                <NumberInput
                  hideControls
                  value={portalEditingIndex}
                  handlersRef={handlers}
                  max={interior.portalCount && interior.portalCount - 1}
                  min={0}
                  step={1}
                  onChange={(val) => {
                    val !== undefined &&
                      setPortalEditingIndex(val || 0)
                      setPortalFlagCheckboxesValue(interior.portals![val!].flags.list)
                      setPortalData(interior.portals![val!])
                  }}
                  styles={{ input: { width: 58, textAlign: 'center' } }}
                />
                
                <ActionIcon size={36} variant='default' onClick={() => { handlers.current?.increment() }}>
                  <FaArrowRight />
                </ActionIcon>
              </Group>
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
                        <AiFillEdit fontSize={20} />
                      </ActionIcon>
                    </Popover.Target>

                    <Popover.Dropdown>
                      <FlagCheckboxGroup locale={locale} value={portalFlagCheckboxesValue!} onChange={setPortalFlagCheckboxesValue} portalEditingIndex={portalEditingIndex} />
                    </Popover.Dropdown>
                  </Popover>
                </Group>

                <Group>
                  <Stack spacing={0}>
                    <Group>
                      <Text>{locale.ui_room_from}:</Text>
                      <Text color='blue.4'>{portalData ? portalData.roomFrom : 'Unknown'}</Text>
                    </Group>

                    <Group>
                      <Text>{locale.ui_room_to}:</Text>
                      <Text color='blue.4'>{portalData ? portalData.roomTo : 'Unknown'}</Text>
                    </Group>
                  </Stack>

                  <Button
                    variant='default'
                    size='xs'
                    onClick={handleFlipPortal}
                  >
                    <FaExchangeAlt fontSize={16} />
                  </Button>
                </Group>
              </>
            }
          </Paper>
        </>
        :
        <Text>No portal found</Text>
      }
    </Paper>
  )
}

export default PortalsElement