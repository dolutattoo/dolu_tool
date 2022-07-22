import { Checkbox, CheckboxGroup, Group, Menu, Text } from "@mantine/core"
import { RoomProps } from "./index"

const Rooms = (props: RoomProps) => {
  const { rooms } = props

  if (rooms === undefined) { return(<>You are not inside an interior !</>) }

  return (
    <>
      {rooms.map((element: any) => {
        const formatRoomId = (roomId: number|string) => {
          if (roomId < 10) {
            return roomId = '0' + roomId
          } else {
            return roomId
          }
        }

        return (
            <Group key={ element.roomId } spacing="md">
              <Text color={ element.isCurrent ? 'orange' : 'gray' } size='xs'>{ formatRoomId(element.roomId) }</Text>
              <Text>{ element.name }</Text>
              <Text>Flag: { element.flag }</Text>
              <Menu radius="md" >
                <CheckboxGroup
                  label="Select room flags"
                  description="You can select multiple flags"
                  orientation='vertical'
                  spacing="xs"
                  size="sm"
                  color="orange"
                >
                  <Checkbox value="1" label="Unknown 1" />
                  <Checkbox value="2" label="Disables wanted level" />
                  <Checkbox value="4" label="Disable exterior shadows" />
                  <Checkbox value="8" label="Unknown 4" />
                  <Checkbox value="32" label="Unknown 5" />
                  <Checkbox value="64" label="Reduces vehicle population" />
                  <Checkbox value="128" label="Reduces ped population" />
                  <Checkbox value="512" label="Unknown 8" />
                  <Checkbox value="1024" label="Disable limbo portals" />
                  <Checkbox value="2048" label="Unknown 10" />
                </CheckboxGroup>
              </Menu>
            </Group>
        )
      })}
    </>
  )
}

export default Rooms