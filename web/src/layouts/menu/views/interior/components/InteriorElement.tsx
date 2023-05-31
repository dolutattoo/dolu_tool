import { Text, Paper, Group, Space } from '@mantine/core'
import { getInteriorData } from '../../../../../atoms/interior'
import { useLocales } from '../../../../../providers/LocaleProvider'

const InteriorElement: React.FC = () => {
  const { locale } = useLocales()
  const interior = getInteriorData()

  return (
    <>
      {/* Current interior infos */}
      <Paper p='md'>
        <Text size={20} weight={600}>{locale.ui_current_interior}</Text>
        <Space h='xs' />
        <Group><Text>{locale.ui_interior_id}:</Text><Text color='blue.4' > {interior.interiorId}</Text></Group>
        <Group><Text>{locale.ui_room_count}:</Text><Text color='blue.4' > {interior.roomCount}</Text></Group>
        <Group><Text>{locale.ui_portal_count}:</Text><Text color='blue.4' > {interior.portalCount}</Text></Group>
        <Group><Text>{locale.ui_current_room}:</Text><Text color='blue.4' > {interior.currentRoom?.index} - {interior.currentRoom?.name}</Text></Group>
      </Paper>
    </>
  )
}

export default InteriorElement
