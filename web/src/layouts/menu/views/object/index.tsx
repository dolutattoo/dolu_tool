import { Accordion, ActionIcon, Button, Group, Paper, ScrollArea, Space, Tabs, Text, TextInput } from '@mantine/core'
import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Ymap, YmapListAtom } from '../../../../atoms/ymap'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import { openModal } from '@mantine/modals'
import { MdLibraryAdd } from 'react-icons/md'
import LoadYmap from './components/modals/LoadYmap'
import AddEntity from './components/modals/AddEntity'
import { Entity } from '../../../../atoms/object'
import { fetchNui } from '../../../../utils/fetchNui'

const Object: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string|null>('new')
    const ymaps = useRecoilValue(YmapListAtom)
    const setYmapTabs = useSetRecoilState(YmapListAtom)
    const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)
    const currentYmap = ymaps ? ymaps.find(e => e.name == activeTab) : { name: "New" }
    const [renameYmapValue, setRenameYmapValue] = useState(currentYmap?.name)

    const ymapTabs = ymaps?.map((ymap: Ymap, index: any) => (
        <Tabs.Tab value={ymap.name}>{ymap.name}</Tabs.Tab>
    ))

    // LOOPING TROUGH YMAPS FILES AND THEIR CONTENT TO BUILD TABS
    const ymapPanels = () => {
        if (ymaps === null || ymaps === undefined) { return null }

        return ymaps.map((ymap:Ymap, index: any) => (
            <Tabs.Panel value={ymap.name}>
                <Space h='sm' />

                <ScrollArea style={{ height: 300 }} offsetScrollbars scrollbarSize={12}>
                    <Accordion variant="contained" radius="sm" value={currentAccordionItem} onChange={setAccordionItem} chevronPosition="left">
                        {currentYmap?.entities?.map((entity: Entity, index: any) => {                            
                            return (
                                <Accordion.Item value={index.toString()}>
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
                                                    fetchNui('dmt:setGizmoEntity', entity)
                                                }}
                                            >Move/Rotate</Button>
                                            
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
            </Tabs.Panel>
        ))
    }

    useNuiEvent('setYmapList', (ymapList: Ymap[]|null) => {
        if (ymapList) {
            setYmapTabs(ymapList)
        }
    })

    return (
        <>
            {/* TITLE */}
            <Group position='apart'>
                <Text size={20}>Ymap manager</Text>
                <ActionIcon
                    size="xl"
                    color="blue.4"
                    onClick={() =>
                        openModal({
                            title: 'Load .ymap.xml file',
                            size: 'xs',
                            children: <LoadYmap />
                        })
                    }
                >
                    <MdLibraryAdd fontSize={30} />
                </ActionIcon>
            </Group>

            <Space h='sm' />
            
            {/* YMAP TABS */}
            <Paper p="md" sx={{ height:500 }}>
                <Tabs value={activeTab} onTabChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="new">
                            New
                        </Tabs.Tab>
                        {ymapTabs ? ymapTabs : null}
                    </Tabs.List>

                    <Tabs.Panel value="new">
                        <Space h='sm' />
                        <Text size={20}>Todo - new ymap ready to be save as New.ymap.xml</Text>
                    </Tabs.Panel>
                    {ymapPanels()}
                </Tabs>
            </Paper>

            <Space h='sm' />

            {/* CURRENT YMAP ACTIONS */}
            <Paper p="md">
                <Group grow>
                    <TextInput
                        disabled={true}
                        value={currentYmap?.name}
                        onChange={(e) => setRenameYmapValue(e.target.value)}
                    />

                    <Button
                        disabled={true}
                        color='blue.4'
                        variant='outline'
                        onClick={() => fetchNui('dmt:setYmapName', { oldName: currentYmap?.name, newName: renameYmapValue})}
                    >Set Name</Button>
                    
                    <Button
                        disabled={true}
                        color='blue.4'
                        variant='outline'
                        onClick={() => setRenameYmapValue(currentYmap?.name)}
                    >Reset Name</Button>
                </Group>

                <Space h='xs' />
                
                <Group grow>
                    <Button
                        disabled={true}
                        color='blue.4'
                        variant='outline'
                        onClick={() =>
                            openModal({
                                title: 'Add a new entity',
                                size: 'xs',
                                children: <AddEntity />
                            })
                        }
                    >
                        Add Entity
                    </Button>

                    <Button
                        disabled={true}
                        color='red.4'
                        variant='outline'
                        onClick={() =>
                            console.log('Todo - remove all entities from current ymap')
                        }
                    >Remove all entities</Button>
                </Group>

                <Space h='xs' />
                
                <Group grow>
                    <Button
                        disabled={true}
                        color='blue.4'
                        variant='outline'
                        onClick={() =>
                            console.log('Todo - save ymap with current name and entities')
                        }
                    >
                        Save Ymap
                    </Button>

                    <Button
                        disabled={true}
                        color='red.4'
                        variant='outline'
                        onClick={() =>
                            console.log('Todo - remove ymap from menu')
                        }
                    >Remove Ymap</Button>
                </Group>
            </Paper>
        </>
    )
}

export default Object