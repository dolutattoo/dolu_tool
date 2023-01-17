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
import { useLocales } from '../../../../providers/LocaleProvider'

const Object: React.FC = () => {
    const { locale } = useLocales()
    const [objectList, setObjectList] = useRecoilState(ObjectListAtom)
    const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)
    
    useNuiEvent('setObjectList', (entitiesList: Entity[]|null) => {
        if (entitiesList !== null) {
            setObjectList(entitiesList)
            if (entitiesList.length > 0) setAccordionItem(entitiesList[0].handle.toString())
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
                <Text size={20}>{locale.ui_object_spawner}</Text>
                <Group position='apart'>
                    <ActionIcon
                        size='xl'
                        color='blue.4'
                        onClick={() =>
                            openModal({
                                title: locale.ui_add_entity,
                                size: 'xs',
                                children: <AddEntity />
                            })
                        }
                    >
                        <MdLibraryAdd fontSize={30} />
                    </ActionIcon>
                    <ActionIcon
                        disabled={objectList.length < 1}
                        size='xl'
                        color='red.4'
                        onClick={() =>
                            openModal({
                                title: locale.ui_delete_all_entities,
                                size: 'md',
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
            <Paper p='md' sx={{ height:685 }}>
                <Space h='sm' />

                <ScrollArea style={{ height: 420 }} offsetScrollbars scrollbarSize={12}>
                    <Accordion
                        variant='contained'
                        radius='sm'
                        value={currentAccordionItem}
                        defaultValue={currentAccordionItem}
                        onChange={(value) => {
                                setAccordionItem(value)                                
                                fetchNui('dolu_tool:setGizmoEntity', parseInt(value as string))
                            }
                        }
                        chevronPosition='left'
                    >
                        {objectList.map((entity: Entity, entityIndex: any) => {
                            return (
                                <Accordion.Item value={entity.handle.toString()}>
                                    <Accordion.Control>
                                        <TextInput error={entity.invalid} defaultValue={entity.name} onChange={(event) => event.currentTarget.value !== '' && fetchNui('dolu_tool:setEntityModel', {entity: entity, index: entityIndex, modelName: event.currentTarget.value})} />
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Group grow>
                                            <Button
                                                variant='light'
                                                color='blue.4'
                                                size='xs'
                                                onClick={() => {
                                                    fetchNui('dolu_tool:goToEntity', entity)
                                                }}
                                            >{locale.ui_goto}</Button>
                                            <Button
                                                variant='light'
                                                color={copiedCoords ? 'teal' : 'blue.4'}
                                                size='xs'
                                                onClick={() => {
                                                    setClipboard(entity.position.x + ', ' + entity.position.y + ', ' + entity.position.z)
                                                    setCopiedCoords(true)
                                                }}
                                            >{copiedCoords ? locale.ui_copied_coords : locale.ui_copy_coords}</Button>
                                            <Button
                                                variant='light'
                                                color={copiedName ? 'teal' : 'blue.4'}
                                                size='xs'
                                                onClick={() => {
                                                    setClipboard(entity.name)
                                                    setCopiedName(true)
                                                }}
                                            >{copiedName ? locale.ui_copied_name : locale.ui_copy_name}</Button>
                                        </Group>
                                        <Space h='xs' />
                                        <Group grow>
                                            <Button
                                                variant='light'
                                                color='blue.4'
                                                size='xs'
                                                onClick={() => {
                                                    fetchNui('dolu_tool:snapEntityToGround', entity)
                                                }}
                                            >{locale.ui_snap_to_ground}</Button>
                                            <Button
                                                variant='light'
                                                color='blue.4'
                                                size='xs'
                                                onClick={() => {
                                                    fetchNui('dolu_tool:addEntity', entity.name)
                                                }}
                                            >{locale.ui_duplicate}</Button>                                            
                                            <Button
                                                variant='light'
                                                color='blue.4'
                                                size='xs'
                                                onClick={() => {
                                                    fetchNui('dolu_tool:deleteEntity', entity.handle)
                                                    setAccordionItem(null)
                                                }}
                                            >{locale.ui_delete}</Button>
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