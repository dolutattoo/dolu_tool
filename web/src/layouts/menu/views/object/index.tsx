import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Accordion, ActionIcon, Button, Group, Paper, ScrollArea, Space, Text, TextInput } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { MdLibraryAdd, MdDeleteForever } from 'react-icons/md'
import { Entity, ObjectListAtom } from '../../../../atoms/object'
import { fetchNui } from '../../../../utils/fetchNui'
import AddEntity from './components/modals/AddEntity'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import DeleteAllEntities from './components/modals/DeleteAllEntities'
import { setClipboard } from '../../../../utils/setClipboard'

const Object: React.FC = () => {
    const [objectList, setObjectList] = useRecoilState(ObjectListAtom);
    const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)
    
    useNuiEvent('setObjectList', (entitiesList: Entity[]|null) => {
        if (entitiesList !== null) {
            setObjectList(entitiesList)
            setAccordionItem(entitiesList[0].handle.toString())
        }
    })
    
    useNuiEvent('setObjectData', (data: {index: number, entity: Entity}) => {
        if (data.entity !== null) {            
            const updatedObject = [...objectList]
            updatedObject[data.index] = data.entity
            setObjectList(updatedObject)
            setAccordionItem(updatedObject[data.index].handle.toString())
        }
    })

    // Copied name button
    const [copiedName, setCopiedName] = useState(false)
    useEffect(() => {
        setTimeout(() => {
        if (copiedName) setCopiedName(false)
        }, 1000)
    }, [copiedName, setCopiedName])

    // Copied coords button
    const [copiedCoords, setCopiedCoords] = useState(false)
    useEffect(() => {
        setTimeout(() => {
        if (copiedCoords) setCopiedCoords(false)
        }, 1000)
    }, [copiedCoords, setCopiedCoords])

    return (
        <>
            {/* TITLE */}
            <Group position='apart'>
                <Text size={20}>Object Spawner</Text>
                <Group position='apart'>
                    <ActionIcon
                        size="xl"
                        color="blue.4"
                        onClick={() =>
                            openModal({
                                title: 'Load .ymap.xml file',
                                size: 'xs',
                                children: <AddEntity />
                            })
                        }
                    >
                        <MdLibraryAdd fontSize={30} />
                    </ActionIcon>
                    <ActionIcon
                        size="xl"
                        color="red.4"
                        onClick={() =>
                            openModal({
                                title: 'Delete all spawned entities',
                                size: 'xs',
                                children: <DeleteAllEntities />
                            })
                        }
                    >
                        <MdDeleteForever fontSize={30} />
                    </ActionIcon>
                </Group>
            </Group>

            <Space h='sm' />
            
            {/* OBJECT LIST*/}
            <Paper p="md" sx={{ height:685 }}>
                <Space h='sm' />

                <ScrollArea style={{ height: 420 }} offsetScrollbars scrollbarSize={12}>
                    <Accordion
                        variant="contained"
                        radius="sm"
                        value={currentAccordionItem}
                        defaultValue={currentAccordionItem}
                        onChange={(value) => {
                                setAccordionItem(value)                                
                                fetchNui('dolu_tool:setGizmoEntity', parseInt(value as string))
                            }
                        }
                        chevronPosition="left"
                    >
                        {objectList.map((entity: Entity, entityIndex: any) => {
                            return (
                                <Accordion.Item value={entity.handle.toString()}>
                                    <Accordion.Control>
                                        <TextInput error={entity.invalid} defaultValue={entity.name} onChange={(event) => event.currentTarget.value !== "" && fetchNui('dolu_tool:setEntityModel', {entity: entity, index: entityIndex, modelName: event.currentTarget.value})} />
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Group grow>
                                            <Button
                                                variant='light'
                                                color="blue.4"
                                                size="xs"
                                                onClick={() => {
                                                    fetchNui('dolu_tool:goToEntity', entity)
                                                }}
                                            >Go to</Button>
                                            <Button
                                                variant='light'
                                                color={copiedCoords ? 'teal' : "blue.4"}
                                                size="xs"
                                                onClick={() => {
                                                    setClipboard(entity.position.x + ', ' + entity.position.y + ', ' + entity.position.z)
                                                    setCopiedCoords(true)
                                                }}
                                            >{copiedCoords ? 'Copied' : 'Copy'} coords</Button>
                                            <Button
                                                variant='light'
                                                color={copiedName ? 'teal' : "blue.4"}
                                                size="xs"
                                                onClick={() => {
                                                    setClipboard(entity.name)
                                                    setCopiedName(true)
                                                }}
                                            >{copiedName ? 'Copied' : 'Copy'} name</Button>
                                        </Group>
                                        <Space h='xs' />
                                        <Group grow>
                                            <Button
                                                variant='light'
                                                color="blue.4"
                                                size="xs"
                                                onClick={() => {
                                                    fetchNui('dolu_tool:snapEntityToGround', entity)
                                                }}
                                            >Snap to ground</Button>
                                            <Button
                                                variant='light'
                                                color="blue.4"
                                                size="xs"
                                                onClick={() => {
                                                    fetchNui('dolu_tool:addEntity', entity.name)
                                                }}
                                            >Duplicate</Button>                                            
                                            <Button
                                                variant='light'
                                                color="blue.4"
                                                size="xs"
                                                onClick={() => {
                                                    fetchNui('dolu_tool:deleteEntity', entity.handle)
                                                    setAccordionItem(null)
                                                }}
                                            >Delete</Button>
                                        </Group>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            )
                        })}
                    </Accordion>
                </ScrollArea>
            </Paper>
        </>
    )
}

export default Object