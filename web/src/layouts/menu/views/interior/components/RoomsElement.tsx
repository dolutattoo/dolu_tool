import { ActionIcon, Group, Paper, Select, Space, Text } from '@mantine/core'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { interiorAtom, timecycleAtom, timecycleListAtom } from '../../../../../atoms/interior'
import { fetchNui } from '../../../../../utils/fetchNui'
import { useLocales } from '../../../../../providers/LocaleProvider'
import { useNuiEvent } from '../../../../../hooks/useNuiEvent'
import { GiCancel } from 'react-icons/gi'

const RoomsElement: React.FC = () => {
  const { locale } = useLocales()
  const interior = useRecoilValue(interiorAtom)
  const [timecycleList, setTimecycleList] = useRecoilState(timecycleListAtom)
  const [timecycle, setTimecycle] = useRecoilState<string | null>(timecycleAtom)

  useNuiEvent('setTimecycleList', (data: Array<{ label: string, value: string }>) => {
    setTimecycleList(data)
  })

  const handlePrevClick = () => {
    const currentIndex = timecycleList.findIndex((option) => option.value === timecycle)
    const prevIndex = currentIndex === 0 ? timecycleList.length - 1 : currentIndex - 1
    setTimecycle(timecycleList[prevIndex].value)
  }

  const handleNextClick = () => {
    const currentIndex = timecycleList.findIndex((option) => option.value === timecycle)
    const nextIndex = (currentIndex + 1) % timecycleList.length
    setTimecycle(timecycleList[nextIndex].value)
  }

  const handleResetClick = () => {
    fetchNui('dolu_tool:resetTimecycle', { roomId: interior.currentRoom?.index }).then((resp) => {
      if (resp !== 0) {
        const currentIndex = timecycleList.findIndex((option) => option.label === resp.label)

        if (currentIndex === -1) {
          setTimecycle(resp.value)
        } else {
          setTimecycle(timecycleList[currentIndex].value)
        }
      }
    })
  }

  useEffect(() => {
    if (timecycle!) fetchNui('dolu_tool:setTimecycle', { value: timecycle, roomId: interior.currentRoom?.index })
  }, [timecycle])

  return (
    <Paper p='md'>
      <Text size={20} weight={600}>{locale.ui_current_room}</Text>
      <Space h='xs' />
      <Paper p='md'>
        <Group><Text>{locale.ui_index}:</Text><Text color='blue.4' > {interior.currentRoom?.index}</Text></Group>
        <Group><Text>{locale.ui_name}:</Text><Text color='blue.4' > {interior.currentRoom?.name}</Text></Group>
        <Group><Text>{locale.ui_flag}:</Text><Text color='blue.4' > {interior.currentRoom?.flags.total}</Text></Group>
        <Group>
          <Text>{locale.ui_timecycle}:</Text>
          <Group spacing={5}>
            {timecycle &&
              <Select
                searchable
                nothingFound={locale.ui_no_timecycle_found}
                data={timecycleList}
                value={timecycle}
                onChange={(value) => setTimecycle(value)}
                width={170}
              />
            }
            <ActionIcon size={36} variant='default' onClick={() => { handlePrevClick() }}>
              <FaArrowLeft />
            </ActionIcon>
            <ActionIcon size={36} variant='default' onClick={() => { handleNextClick() }}>
              <FaArrowRight />
            </ActionIcon>
            <ActionIcon size={36} variant='default' onClick={() => { handleResetClick() }}>
              <GiCancel />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    </Paper>
  )
}

export default RoomsElement