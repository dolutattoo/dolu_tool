import { Group, Text } from '@mantine/core'
import { IconBaseProps } from 'react-icons'

interface Props {
  header: string
  Icon: React.ComponentType<IconBaseProps>
}

const HeaderGroup: React.FC<Props> = ({ header, Icon }) => {
  return (
    <Group position='apart'>
      <Text>{header}</Text>
      <Icon size={24} />
    </Group>
  )
}

export default HeaderGroup
