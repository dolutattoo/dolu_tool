import { Stack, SimpleGrid, Paper, Text, Space } from '@mantine/core'
import InteriorElement from './components/InteriorElement'
import RoomsElement from './components/RoomsElement'
import PortalsElement from './components/PortalsElement'
import { useLocales } from '../../../../providers/LocaleProvider'
import { getInteriorData } from '../../../../atoms/interior'

const Interior: React.FC = () => {
  const { locale } = useLocales()
  const interior = getInteriorData()

  return (
    <SimpleGrid cols={1}>
      <Stack>
        {
          interior?.interiorId <= 0
            ?
            <Paper p='md'>
              <Text size={24} weight={600}>{locale.ui_current_interior}</Text>
              <Space h='sm' />
              <Text color='red.4'>{locale.ui_not_in_interior}</Text>
            </Paper>
            :
            <>
              <InteriorElement />
              <RoomsElement />
              <PortalsElement />
            </>
        }
      </Stack>
    </SimpleGrid>
  )
}

export default Interior
