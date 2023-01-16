import { Button, Group, Stack, Text } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { fetchNui } from '../../../../../../utils/fetchNui'

const DeleteAllEntities = () => {

  return (
    <Stack>
      <Text>Delete all spawned entities ?</Text>
      <Group grow>
        <Button
          uppercase
          variant="outline"
          color="green.4"
          onClick={() => {
            closeAllModals()
            fetchNui('dolu_tool:deleteAllEntities')
          }}
        >
          Confirm
        </Button>
        <Button
          uppercase
          variant="outline"
          color="red.4"
          onClick={() => {
            closeAllModals()
          }}
        >
          Cancel
        </Button>
      </Group>
    </Stack>
  )
}

export default DeleteAllEntities
