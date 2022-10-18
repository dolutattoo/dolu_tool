import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'
import { fetchNui } from '../../../../../../utils/fetchNui'

const LoadYmap: React.FC = () => {
  const [fileName, setFileName] = useState('legion_square_parking')

  return (
    <Stack>
      <TextInput label="Load .ymap.xml file" description="Files must be placed in 'DoluMappingTool/ymap/'" value={fileName} onChange={(e) => setFileName(e.target.value)} />
      <Button
        uppercase
        disabled={fileName === ''}
        variant="outline"
        color="blue.4"
        onClick={() => {
          closeAllModals()
          fetchNui('dmt:loadYmap', fileName)
        }}
      >
        Confirm
      </Button>
    </Stack>
  )
}

export default LoadYmap
