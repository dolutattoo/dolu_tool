import { Stack, SimpleGrid, Paper, Text, Space, Slider, Group, NumberInput, Badge, Button } from '@mantine/core'
import { useState } from 'react'
import { GiSpring } from 'react-icons/gi'
import { AiOutlineRotateRight } from 'react-icons/ai'
import { IoMdResize } from 'react-icons/io'
import { useRecoilState } from 'recoil'
import { StanceSettings, suspensionHeightAtom, wheelCamberFrontAtom, wheelCamberRearAtom, wheelCountAtom, wheelOffsetFrontAtom, wheelOffsetRearAtom } from '../../../../../atoms/stancer'
import { useNuiEvent } from '../../../../../hooks/useNuiEvent'
import { fetchNui } from '../../../../../utils/fetchNui'
import { debugData } from '../../../../../utils/debugData'

debugData([
  {
    action: 'setStancerTab',
    data: {
      vehicleName: 'baller',
      wheelCount: 4,
      suspensionHeight: 0,
      wheelOffsetFront: 0,
      wheelOffsetRear: 0,
      wheelCamberFront: 0,
      wheelCamberRear: 0
  }
  }
])

const Stancer: React.FC = () => {
  const [isInVehicle, setIsInVehicle] = useState<boolean>(false)
  const [vehicleName, setVehicleName] = useState<string>("")
  const [suspensionHeight, setSuspensionHeight] = useRecoilState(suspensionHeightAtom)
  const [wheelCount, setWheelCount] = useRecoilState(wheelCountAtom)
  const [wheelOffsetFront, setWheelOffsetFront] = useRecoilState(wheelOffsetFrontAtom)
  const [wheelOffsetRear, setWheelOffsetRear] = useRecoilState(wheelOffsetRearAtom)
  const [wheelCamberFront, setWheelCamberFront] = useRecoilState(wheelCamberFrontAtom)
  const [wheelCamberRear, setWheelCamberRear] = useRecoilState(wheelCamberRearAtom)

  useNuiEvent('setStancerTab', (data: StanceSettings) => {
    setIsInVehicle(data.wheelCount !== undefined)

    if (data.wheelCount !== undefined) {
      setVehicleName(data.vehicleName)
      setSuspensionHeight(data.suspensionHeight)
      setWheelCount(data.wheelCount)
      setWheelOffsetFront(data.wheelOffsetFront)
      setWheelOffsetRear(data.wheelOffsetRear)
      setWheelCamberFront(data.wheelCamberFront*-1)
      setWheelCamberRear(data.wheelCamberRear)
    }
  })

  return (
    <SimpleGrid cols={1}>
      <Stack>
        <Group position='apart'>
          <Text size={24} weight={600}>Stancer Menu</Text>
          <Badge variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>{vehicleName}</Badge>
        </Group>
        
        {isInVehicle ? 
          <>
            <Paper p="xs" withBorder>
              <Group position='apart'>
                <Text size={16} weight={400}>Suspension height</Text>
                <NumberInput
                  decimalSeparator="."
                  value={suspensionHeight}
                  defaultValue={suspensionHeight}
                  min={-0.3}
                  max={0.5}
                  step={0.001}
                  precision={3}
                  disabled={wheelCount<4}
                  onChange={(value) => {
                    setSuspensionHeight(value!)
                    fetchNui('dolu_tool:setStancer', { suspensionHeight: value })
                  }}
                  stepHoldDelay={500}
                  stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                  style={{ width: '80px' }}
                />
              </Group>
              
              <Space h="xs" />
              
              <Slider
                label={null}
                value={suspensionHeight}
                defaultValue={suspensionHeight}
                min={-1}
                max={1}
                step={0.001}
                disabled={wheelCount<4}
                onChange={(value) => {
                  setSuspensionHeight(value)
                  fetchNui('dolu_tool:setStancer', { suspensionHeight: value })
                }}
                thumbChildren={<GiSpring size={18} />}
                thumbSize={28}
                size='lg'
                styles={{ thumb: { borderWidth: 2, padding: 3 } }}
              />
            </Paper>
            
            <Paper p="xs" withBorder>
              <Group position='apart'>
                <Text size={16} weight={400}>Wheels Offset Front</Text>
                <NumberInput
                  decimalSeparator="."
                  value={wheelOffsetFront}
                  defaultValue={wheelOffsetFront}
                  min={-0.3}
                  max={0.5}
                  step={0.001}
                  precision={3}
                  disabled={wheelCount<4}
                  onChange={(value) => {
                    setWheelOffsetFront(value!)
                    fetchNui('dolu_tool:setStancer', { wheelOffsetFront: value })
                  }}
                  stepHoldDelay={500}
                  stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                  style={{ width: '80px' }}
                />
              </Group>
              
              <Space h="xs" />
              
              <Slider
                label={null}
                value={wheelOffsetFront}
                defaultValue={wheelOffsetFront}
                min={0.3}
                max={1.3}
                step={0.001}
                disabled={wheelCount<4}
                onChange={(value) => {
                  setWheelOffsetFront(value)
                  fetchNui('dolu_tool:setStancer', { wheelOffsetFront: value })
                }}
                thumbChildren={<IoMdResize size={18} />}
                thumbSize={28}
                size='lg'
                styles={{ thumb: { borderWidth: 2, padding: 3 } }}
              />
            </Paper>
            
            <Paper p="xs" withBorder>
              <Group position='apart'>
                <Text size={16} weight={400}>Wheels Offset Rear</Text>
                <NumberInput
                  decimalSeparator="."
                  value={wheelOffsetRear}
                  defaultValue={wheelOffsetRear}
                  min={-0.3}
                  max={0.5}
                  step={0.001}
                  precision={3}
                  disabled={wheelCount<4}
                  onChange={(value) => {
                    setWheelOffsetRear(value!)
                    fetchNui('dolu_tool:setStancer', { wheelOffsetRear: value })
                  }}
                  stepHoldDelay={500}
                  stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                  style={{ width: '80px' }}
                />
              </Group>
              
              <Space h="xs" />
              
              <Slider
                label={null}
                value={wheelOffsetRear}
                defaultValue={wheelOffsetRear}
                min={0.3}
                max={1.3}
                step={0.001}
                disabled={wheelCount<4}
                onChange={(value) => {
                  setWheelOffsetRear(value)
                  fetchNui('dolu_tool:setStancer', { wheelOffsetRear: value })
                }}
                thumbChildren={<IoMdResize size={18} />}
                thumbSize={28}
                size='lg'
                styles={{ thumb: { borderWidth: 2, padding: 3 } }}
              />
            </Paper>
            
            <Paper p="xs" withBorder>
              <Group position='apart'>
                <Text size={16} weight={400}>Wheels Camber Front</Text>
                <NumberInput
                  decimalSeparator="."
                  value={wheelCamberFront}
                  defaultValue={wheelCamberFront}
                  min={-0.3}
                  max={0.5}
                  step={0.001}
                  precision={3}
                  disabled={wheelCount<4}
                  onChange={(value) => {
                    setWheelCamberFront(value!)
                    fetchNui('dolu_tool:setStancer', { wheelCamberFront: value })
                  }}
                  stepHoldDelay={500}
                  stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                  style={{ width: '80px' }}
                />
              </Group>
              
              <Space h="xs" />
              
              <Slider
                label={null}
                value={wheelCamberFront}
                defaultValue={wheelCamberFront}
                min={-0.3}
                max={0.5}
                step={0.001}
                disabled={wheelCount<4}
                onChange={(value) => {
                  setWheelCamberFront(value)
                  fetchNui('dolu_tool:setStancer', { wheelCamberFront: value })
                }}
                thumbChildren={<AiOutlineRotateRight size={18} />}
                thumbSize={28}
                size='lg'
                styles={{ thumb: { borderWidth: 2, padding: 3 } }}
              />
            </Paper>
            
            <Paper p="xs" withBorder>
              <Group position='apart'>
                <Text size={16} weight={400}>Wheels Camber Rear</Text>
                <NumberInput
                  decimalSeparator="."
                  value={wheelCamberRear}
                  defaultValue={wheelCamberRear}
                  min={-0.3}
                  max={0.5}
                  step={0.001}
                  precision={3}
                  disabled={wheelCount<4}
                  onChange={(value) => {
                    setWheelCamberRear(value!)
                    fetchNui('dolu_tool:setStancer', { wheelCamberRear: value })
                  }}
                  stepHoldDelay={500}
                  stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                  style={{ width: '80px' }}
                />
              </Group>
              
              <Space h="xs" />
              
              <Slider
                label={null}
                value={wheelCamberRear}
                defaultValue={wheelCamberRear}
                min={-0.3}
                max={0.5}
                step={0.001}
                disabled={wheelCount<4}
                onChange={(value) => {
                  setWheelCamberRear(value)
                  fetchNui('dolu_tool:setStancer', { wheelCamberRear: value })
                }}
                thumbChildren={<AiOutlineRotateRight size={18} />}
                thumbSize={28}
                size='lg'
                styles={{ thumb: { borderWidth: 2, padding: 3 } }}
              />
            </Paper>
          </>
        : 
        <Paper p="xs" withBorder>
          <Text size={16} weight={400}>You are not in a vehicle</Text>
        </Paper> }
      </Stack>
    </SimpleGrid>
  )
}

export default Stancer
