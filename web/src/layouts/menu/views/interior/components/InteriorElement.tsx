import { memo } from 'react'
import { Text, Paper, Group, Space } from '@mantine/core'
import { getInteriorData } from '../../../../../atoms/interior'
import { useLocales } from '../../../../../providers/LocaleProvider'

// Memoized info row component
const InfoRow = memo(({ label, value }: { label: string, value: string | number | undefined }) => (
  <Group>
    <Text>{label}:</Text>
    <Text color='blue.4'>{value}</Text>
  </Group>
));

// Memoized current room display with locale prop
const CurrentRoomInfo = memo(({ room, locale }: { 
  room: { index?: number, name?: string } | undefined,
  locale: { ui_current_room: string }
}) => (
  <Group>
    <Text>{locale.ui_current_room}:</Text>
    <Text color='blue.4'>{room?.index} - {room?.name}</Text>
  </Group>
));

const InteriorElement: React.FC = memo(() => {
  const { locale } = useLocales()
  const interior = getInteriorData()

  return (
    <Paper p='md'>
      <Text size={20} weight={600}>{locale.ui_current_interior}</Text>
      <Space h='xs' />
      <InfoRow label={locale.ui_interior_id} value={interior.interiorId} />
      <InfoRow label={locale.ui_room_count} value={interior.roomCount} />
      <InfoRow label={locale.ui_portal_count} value={interior.portalCount} />
      <CurrentRoomInfo room={interior.currentRoom} locale={locale} />
    </Paper>
  )
});

// Add display name for debugging
InteriorElement.displayName = 'InteriorElement'

export default InteriorElement
