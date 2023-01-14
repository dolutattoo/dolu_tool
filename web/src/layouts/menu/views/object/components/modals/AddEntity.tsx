import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'
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
          fetchNui('dmt:addEntity', entityName)
        }}
      >
        Confirm
      </Button>
    </Stack>
  )
}

export default AddEntity
