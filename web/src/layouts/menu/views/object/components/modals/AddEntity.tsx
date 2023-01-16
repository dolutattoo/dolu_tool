import { Stack, Button, TextInput } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { useRecoilState } from 'recoil'
import { ObjectNameAtom } from '../../../../../../atoms/object'
import { fetchNui } from '../../../../../../utils/fetchNui'

const AddEntity: React.FC = () => {
  const [entityName, setEntityName] = useRecoilState(ObjectNameAtom)

  return (
    <Stack>
      <TextInput label="Add a new entity" description="Enter the name of the entity" value={entityName} onChange={(e) => setEntityName(e.target.value)} />
      <Button
        uppercase
        disabled={entityName === ''}
        variant="outline"
        color="blue.4"
        onClick={() => {
          closeAllModals()
          fetchNui('dolu_tool:addEntity', entityName)
        }}
      >
        Confirm
      </Button>
    </Stack>
  )
}

export default AddEntity
