import { Stack, SimpleGrid, Paper, Text, Space } from '@mantine/core'
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
              <Text size={24} weight={600}>Current interior infos</Text>
              <Space h="sm" />
              <Text color="red.4">You are not inside any interior.</Text>
          </Paper>
          :
          <InteriorElement/>
        }
      </Stack>
    </SimpleGrid>
  )
}

export default Interior
