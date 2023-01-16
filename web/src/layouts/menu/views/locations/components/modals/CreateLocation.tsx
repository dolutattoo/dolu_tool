import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'
import { fetchNui } from '../../../../../../utils/fetchNui'
import { useSetRecoilState } from 'recoil'
import { locationCustomFilterAtom } from '../../../../../../atoms/location'

const CreateLocation: React.FC = () => {
  const [locationName, setLocationName] = useState('')
  const setCustomLocationCheckbox = useSetRecoilState(locationCustomFilterAtom)

  return (
    <Stack>
      <TextInput label="Location name" description="Will save your current coords and heading" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
      <Button
        uppercase
        disabled={locationName === ''}
        variant="outline"
        color="blue.4"
        onClick={() => {
          closeAllModals()
          fetchNui('dolu_tool:createCustomLocation', locationName)
          setCustomLocationCheckbox(true)
        }}
      >
        Confirm
      </Button>
    </Stack>
  )
}

export default CreateLocation
