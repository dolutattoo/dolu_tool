import { Button, Group, Stack, Text } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { useSetRecoilState } from 'recoil'
import { locationCustomFilterAtom } from '../../../../../../atoms/location'
import { fetchNui } from '../../../../../../utils/fetchNui'

const DeleteLocation = (props: {name: string}) => {
  const { name } = props
  const setCustomLocationCheckbox = useSetRecoilState(locationCustomFilterAtom)

  return (
    <Stack>
      <Text>Delete '{name}' ?</Text>
      <Group grow>
        <Button
          uppercase
          variant="outline"
          color="green.4"
          onClick={() => {
            closeAllModals()
            fetchNui('dmt:deleteLocation', name)
            setCustomLocationCheckbox(true)
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

export default DeleteLocation
