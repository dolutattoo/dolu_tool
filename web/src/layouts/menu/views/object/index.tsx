import { Space, Text } from '@mantine/core'
import YmapLoader from './components/YmapLoader'
import ObjectSpawner from './components/ObjectSpawner'

const Object: React.FC = () => {

    return (
        <>
            <Text size={20}>Object manager</Text>

            <Space h='sm' />

            {/* Object spawner */}
            <ObjectSpawner />
            
            <Space h='sm' />

            {/* Load .ymap.xml */}
            <YmapLoader />
        </>
    )
}

export default Object