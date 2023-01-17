import { Group, Paper, Select, Space, Text } from '@mantine/core'
import { useState } from 'react'
import { interiorAtom, timecycleListAtom } from '../../../../../atoms/interior'
import { fetchNui } from '../../../../../utils/fetchNui'
import { useLocales } from '../../../../../providers/LocaleProvider'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useNuiEvent } from '../../../../../hooks/useNuiEvent'

const RoomsElement: React.FC = () => {
    const { locale } = useLocales()
    const interior = useRecoilValue(interiorAtom)
    const [timecycleList, setTimecycleList] = useRecoilState(timecycleListAtom)
    const [timecycle, setTimecycle] = useState<string | null>(interior.currentRoom?.timecycle ? interior.currentRoom?.timecycle.toString() : null)
    
    useNuiEvent('setTimecycleList', (data: Array<{ label: string, value: string }>) => {     
        setTimecycleList(data)
    })

    useNuiEvent('setIntData', (data: any) => {
        if (data.currentRoom !== undefined) setTimecycle(data.currentRoom.timecycle)
    })

    return (
        <Paper p='md'>
            <Text size={24} weight={600}>{locale.ui_current_room}</Text>
            <Space h='xs' />
            <Paper p='md'>
                <Group><Text>{locale.ui_index}:</Text><Text color='blue.4' > { interior.currentRoom?.index }</Text></Group>
                <Group><Text>{locale.ui_name}:</Text><Text color='blue.4' > { interior.currentRoom?.name }</Text></Group>
                <Group><Text>{locale.ui_flag}:</Text><Text color='blue.4' > { interior.currentRoom?.flags.total }</Text></Group>
                <Group>
                    <Text>{locale.ui_timecycle}:</Text>
                    {timecycle && <Select 
                        searchable
                        nothingFound={locale.ui_no_timecycle_found}
                        data={timecycleList}
                        value={timecycle}
                        onChange={(value) => {
                            setTimecycle(value)
                            fetchNui('dolu_tool:setTimecycle', {value: value, roomId: interior.currentRoom?.index})
                        }}
                    />}
                </Group>
            </Paper>
        </Paper>
    )
}

export default RoomsElement