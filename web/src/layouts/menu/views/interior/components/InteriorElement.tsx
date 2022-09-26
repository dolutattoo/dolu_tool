import { Text, Paper, Group } from "@mantine/core"
import { getInteriorData } from "../../../../../atoms/interior"

const InteriorElement: React.FC = () => {
    const interior = getInteriorData()

    return (
        <>
            <Paper p="md">
                <Text size={20} weight={600}>Current interior infos</Text>
                <Group><Text>Interior ID:</Text><Text color="orange.4" > { interior.interiorId }</Text></Group>
                <Group><Text>Room count:</Text><Text color="orange.4" > { interior.roomCount }</Text></Group>
                <Group><Text>Portal count:</Text><Text color="orange.4" > { interior.portalCount }</Text></Group>
                <Group><Text>Current room:</Text><Text color="orange.4" > { interior.currentRoom?.id } - { interior.currentRoom?.name }</Text></Group>
            </Paper>
        </>
    )
}

export default InteriorElement