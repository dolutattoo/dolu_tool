import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'
import { fetchNui } from '../../../../../../utils/fetchNui'
import { useSetRecoilState } from 'recoil'
import { locationCustomFilterAtom } from '../../../../../../atoms/location'
import { useLocales } from '../../../../../../providers/LocaleProvider'

const CreateLocation: React.FC = () => {
  const { locale } = useLocales()
  const [locationName, setLocationName] = useState('')
  const setCustomLocationCheckbox = useSetRecoilState(locationCustomFilterAtom)

  return (
    <Stack>
      <TextInput label={locale.ui_location_name} description={locale.ui_create_location_description} value={locationName} onChange={(e) => setLocationName(e.target.value)} />
      <Button
        uppercase
        disabled={locationName === ''}
        variant='light'
        color='blue.4'
        onClick={() => {
          closeAllModals()
          fetchNui('dolu_tool:createCustomLocation', locationName)
          setCustomLocationCheckbox(true)
        }}
      >
        {locale.ui_confirm}
      </Button>
    </Stack>
  )
}

export default CreateLocation
