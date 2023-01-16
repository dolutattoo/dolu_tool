import { Group, Paper, Select, Space, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { getInteriorData } from '../../../../../atoms/interior'
import { fetchNui } from '../../../../../utils/fetchNui'
import TIMECYCLE_LIST from '../../../../../../../shared/data/timecycleList.json'
import { useLocales } from '../../../../../providers/LocaleProvider'

const RoomsElement: React.FC = () => {
    const { locale } = useLocales()
    const interior = getInteriorData()
    const [timecycle, setTimecycle] = useState<string | null>(interior.currentRoom?.timecycle ? interior.currentRoom?.timecycle.toString() : null)
    
    useEffect(() => {
        if (interior.currentRoom && interior.currentRoom.timecycle.toString() != timecycle) setTimecycle(interior.currentRoom.timecycle.toString())
    }, [])

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
                        data={TIMECYCLE_LIST}
                        value={timecycle}
                        onChange={(value) => {
                        setTimecycle(value)
                        fetchNui('dolu_tool:setTimecycle', {value: value, roomId: interior.currentRoom?.index})
                    }}/>}
                </Group>
            </Paper>
        </Paper>
    )
}

export default RoomsElement