import { useRef } from 'react'
import { ActionIcon, Group, NumberInputHandlers, Paper, Progress, ScrollArea, Space, Stack, Text, Title } from '@mantine/core'
import { useRecoilValue } from 'recoil'
import { vehicleModsAtom } from '../../../../../atoms/vehicle'

const VehicleCustoms: React.FC = () => {
    const vehiclesMods = useRecoilValue(vehicleModsAtom)
    const handlers = useRef<NumberInputHandlers>()

    const vehicleModsPapers = (obj: Array<{name: string, level: number, current: number}>) => {
        return Object.entries(obj).map(([index, {name, level, current}]) => {
            return (
                <Paper key={index} p='xs'>
                    <Title size='sm'>{name}</Title>
                    <Space h='xs' />
                    <Group grow>
                        <Progress size='xl' style={{ minWidth: '210px' }} value={(current / level) * 100} />
                        
                        <Text>Level:</Text><Text color='blue.4'> {current ?  'Stage ' + current : 'Stock'} / {level}</Text>
                        
                        <ActionIcon
                            size={36}
                            style={{ maxWidth: '20px' }}
                            variant='default'
                            onClick={() => {handlers.current?.decrement()}
                        }>–</ActionIcon>
                        <ActionIcon
                            size={36}
                            style={{ maxWidth: '20px' }}
                            variant='default'
                            onClick={() => {handlers.current?.increment()}
                        }>+</ActionIcon>
                    </Group>
                    
                </Paper>
            )
        })
    }

    return (
        <>
            <ScrollArea style={{ height: '650px' }}>
                <Stack>
                    {vehicleModsPapers(vehiclesMods)}
                </Stack>
            </ScrollArea>
        </>
    )
}

export default VehicleCustoms