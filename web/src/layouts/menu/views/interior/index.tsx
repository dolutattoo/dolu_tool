import { Stack, SimpleGrid, Paper } from '@mantine/core'
import { getInteriorData } from '../../../../atoms/interior'
import InteriorElement from './components/InteriorElement'

const Interior: React.FC = () => {
  const interior = getInteriorData()

  return (
    <SimpleGrid cols={1}>
      <Stack>
        {
          interior?.interiorId <= 0
          ?
          <Paper p="md">
            You are not inside any interior.
          </Paper>
          :
          <InteriorElement/>
        }
      </Stack>
    </SimpleGrid>
  )
}

export default Interior
