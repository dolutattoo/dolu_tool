import { useRef } from 'react'
import { Image, ActionIcon, Center, Group, NumberInputHandlers, Paper, Progress, ScrollArea, Space, Stack, Text, Title, Accordion } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
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
            <Paper style={{ width: '488px', maxHeight: '150px' }}>
                <Carousel
                    height={150}
                    slideSize='33.3333%'
                    slideGap='xl'
                    loop
                    slidesToScroll={1}
                >
                    {Object.entries(vehiclesMods).map(([index, {name, level, current, imgName}]) => {
                        return (
                            <Carousel.Slide key={index}>
                                <Center>
                                    <Image
                                        width='100px'
                                        alt='1'
                                        src={imgName}
                                        withPlaceholder={true}
                                        sx={{
                                            marginTop: '10px'
                                        }}
                                    />
                                </Center>
                                <Center>
                                    <Title size={20}>{name}</Title>
                                </Center>
                            </Carousel.Slide>
                        )
                    })}

                </Carousel>

                <Space h='md' />
                
                <ScrollArea style={{ height: '480px' }}>
                    {vehicleModsPapers(vehiclesMods)}
                </ScrollArea>
            </Paper>
        </>
    )
}

export default VehicleCustoms