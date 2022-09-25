import { Stack, SimpleGrid, Paper } from '@mantine/core'
import { getInteriorData } from '../../../../atoms/interior'
import InteriorData from './components/InteriorData'

const Interior: React.FC = () => {
  const interior = getInteriorData()

  return (
    <SimpleGrid cols={1}>
      <Stack>
        <Paper p="md">
          {interior?.interiorId <= 0 ? 'You are not inside any interior.' : <InteriorData/>}
        </Paper>
      </Stack>
    </SimpleGrid>
  )
}

export default Interior
