import { Stack, SimpleGrid, Paper } from '@mantine/core'
import { getInteriorData } from '../../../../atoms/interior'

const Interior: React.FC = () => {
  const interior = getInteriorData()

  return (
    <SimpleGrid cols={1}>
      <Stack>
        <Paper p="md">
          {interior?.interiorId <= 0 ? 'You are not inside any interior.' : 'TODO: Interior detected.'}
        </Paper>
      </Stack>
    </SimpleGrid>
  )
}

export default Interior
