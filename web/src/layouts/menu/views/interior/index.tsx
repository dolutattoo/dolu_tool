import { Paper, SimpleGrid, Space, Stack, Text } from '@mantine/core'
import { getInteriorData } from '../../../../atoms/interior'
import { useLocales } from '../../../../providers/LocaleProvider'
import InteriorElement from './components/InteriorElement'
import PortalsElement from './components/PortalsElement'
import RoomsElement from './components/RoomsElement'

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
              <Text color='dimmed'>{locale.ui_not_in_interior}</Text>
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
