import { Group, Paper, Select, Space, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import { getInteriorData } from "../../../../../atoms/interior"
import { fetchNui } from "../../../../../utils/fetchNui"
import TIMECYCLE_LIST from "../../../../../../../shared/data/timecycleList.json"

const RoomsElement: React.FC = () => {
    const interior = getInteriorData()
    const [timecycle, setTimecycle] = useState<string | null>(interior.currentRoom?.timecycle ? interior.currentRoom?.timecycle.toString() : null)
    
    useEffect(() => {
        if (interior.currentRoom && interior.currentRoom.timecycle.toString() != timecycle) setTimecycle(interior.currentRoom.timecycle.toString())
    }, [])

    return (
        <Paper p="md">
            <Text size={24} weight={600}>Current room infos</Text>
            <Space h="xs" />
            <Paper p="md">
                <Group><Text>Index:</Text><Text color="blue.4" > { interior.currentRoom?.index }</Text></Group>
                <Group><Text>Name:</Text><Text color="blue.4" > { interior.currentRoom?.name }</Text></Group>
                <Group><Text>Flag:</Text><Text color="blue.4" > { interior.currentRoom?.flag }</Text></Group>
                <Group>
                    <Text>Timecycle:</Text>
                    {timecycle && <Select 
                        searchable
                        nothingFound="No timecycle found"
                        data={TIMECYCLE_LIST}
                        value={timecycle}
                        onChange={(value) => {
                        setTimecycle(value)
                        fetchNui('dmt:setTimecycle', {value: value, roomId: interior.currentRoom?.index})
                    }}/>}
                </Group>
            </Paper>
        </Paper>
    )
}

export default RoomsElement