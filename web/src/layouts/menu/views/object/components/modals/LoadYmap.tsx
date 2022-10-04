import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'
import { fetchNui } from '../../../../../../utils/fetchNui'

const LoadYmap: React.FC = () => {
  const [fileName, setFileName] = useState('.ymap.xml')

  return (
    <Stack>
      <TextInput label="Load .ymap.xml file" description="File must be placed in 'DoluMappingTool/shared/data/ymap/'" value={fileName} onChange={(e) => setFileName(e.target.value)} />
      <Button
        uppercase
        disabled={fileName === '' || fileName === '.ymap.xml'}
        variant="outline"
        color="blue.4"
        onClick={() => {
          closeAllModals()
          fetchNui('dmt:addEntity', fileName)
        }}
      >
        Confirm
      </Button>
    </Stack>
  )
}

export default LoadYmap
