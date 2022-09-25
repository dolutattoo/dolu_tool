import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'

const CreateLocation: React.FC = () => {
  const [locationName, setLocationName] = useState('')

  return (
    <Stack>
      <TextInput label="Location name" description="Will save your current coords and heading" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
      <Button
        uppercase
        disabled={locationName === ''}
        variant="outline"
        color="orange"
        onClick={() => {
          closeAllModals()
          console.log(locationName)
        }}
      >
        Confirm
      </Button>
    </Stack>
  )
}

export default CreateLocation
