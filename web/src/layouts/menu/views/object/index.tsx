import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { Accordion, ActionIcon, Button, Group, Paper, ScrollArea, Space, Text } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { MdLibraryAdd, MdDeleteForever } from 'react-icons/md'
import { Entity, ObjectListAtom } from '../../../../atoms/object'
import { fetchNui } from '../../../../utils/fetchNui'
import AddEntity from './components/modals/AddEntity'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import DeleteAllEntities from './components/modals/DeleteAllEntities'

const Object: React.FC = () => {
    const [objectList, setObjectList] = useRecoilState(ObjectListAtom);
    const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)

    useNuiEvent('setObjectList', (entitiesList: Entity[]|null) => {
        if (entitiesList) setObjectList(entitiesList)
    })

    return (
        <>
            {/* TITLE */}
            <Group position='apart'>
                <Text size={20}>Object spawner</Text>
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
            <Paper p="md" sx={{ height:500 }}>
                <Space h='sm' />

                <ScrollArea style={{ height: 420 }} offsetScrollbars scrollbarSize={12}>
                    <Accordion
                        variant="contained"
                        radius="sm"
                        value={currentAccordionItem}
                        defaultValue={currentAccordionItem}
                        onChange={(value) => {
                                setAccordionItem(value)                                
                                fetchNui('dmt:setGizmoEntity', parseInt(value as string))
                            }
                        }
                        chevronPosition="left"
                    >
                        {objectList.map((entity: Entity, entityIndex: any) => {                            
                            return (
                                <Accordion.Item value={entity.handle.toString()}>
                                    <Accordion.Control>
                                        <Text size="sm" weight={500}>{entity.name}</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Group grow>
                                            <Button
                                                variant="outline"
                                                color="blue.4"
                                                size="xs"
                                                onClick={() => {
                                                    fetchNui('dmt:snapEntityToGround', entity)
                                                }}
                                            >Snap to ground</Button>
                                            
                                            <Button
                                                variant="outline"
                                                color="blue.4"
                                                size="xs"
                                                onClick={() => {
                                                    fetchNui('dmt:deleteEntity', entity.handle)
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