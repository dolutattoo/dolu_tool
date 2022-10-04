import { Accordion, ActionIcon, Button, Group, Paper, ScrollArea, Space, Text } from "@mantine/core"
import { openModal } from "@mantine/modals"
import { useState } from "react"
import { MdLibraryAdd } from "react-icons/md"
import { useSetRecoilState } from "recoil"
import { Entity, getObjectList, ObjectListAtom } from "../../../../../atoms/object"
import { useNuiEvent } from "../../../../../hooks/useNuiEvent"
import { fetchNui } from "../../../../../utils/fetchNui"
import AddEntity from "./modals/AddEntity"

const ObjectSpawner: React.FC = () => {
  const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)
  const setEntities = useSetRecoilState(ObjectListAtom)
  const spawnedObjects = getObjectList()

  useNuiEvent('setEntities', (data: Entity[]) => {
    console.log(JSON.stringify(data, null, '\t'))
    setEntities(data)
  })
  
  const ObjectList = spawnedObjects.map((entity: Entity, index: any) => (
    <Accordion.Item value={index.toString()}>
      <Accordion.Control>
        <Text size="sm" weight={500}>{entity.name}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Group position="apart">
          <Text size="sm">Position:</Text><Text color='blue.4' size="sm"> {entity.position.x}, {entity.position.y}, {entity.position.z}</Text>
        </Group>
        <Group position="apart">
          <Text size="sm">Rotation:</Text><Text color='blue.4' size="sm"> {entity.rotation.x}, {entity.rotation.y}, {entity.rotation.z}, {entity.rotation.w}</Text>
        </Group>

        <Button
          uppercase
          variant="outline"
          color="blue.4"
          onClick={() => {
            fetchNui('dmt:deleteEntity', entity.handle)
            setAccordionItem(null)
          }}
        >
          Delete
        </Button>

      </Accordion.Panel>
    </Accordion.Item>
  ))
  
  return (
    <>
      <Paper p="md">
        <Group position='apart'>
          <Text size={20} weight={600}>Spawned objects</Text>

          <ActionIcon
            size="xl"
            color="blue.4"
            onClick={() =>
              openModal({
                title: 'Add a new entity',
                size: 'xs',
                children: <AddEntity />
              })
            }
          >
            <MdLibraryAdd fontSize={30} />
          </ActionIcon>
        </Group>

        <Space h='sm' />

        <ScrollArea style={{ height: 300 }} offsetScrollbars scrollbarSize={12}>
          <Accordion variant="separated" radius="sm" value={currentAccordionItem} onChange={setAccordionItem} chevronPosition="left">
            {ObjectList[0] ? ObjectList : 
              <Paper p="md">
                <Text size="md" weight={400} color="red.4">No spawned object</Text>
              </Paper>
            }
          </Accordion>
        </ScrollArea>
      </Paper>
    </>
  )
}
  
export default ObjectSpawner