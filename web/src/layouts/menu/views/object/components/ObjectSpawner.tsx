import { Accordion, ActionIcon, Group, Paper, ScrollArea, Space, Text } from "@mantine/core"
import { useState } from "react"
import { MdLibraryAdd } from "react-icons/md"
import { Entity, getObjectList } from "../../../../../atoms/object"

const ObjectSpawner: React.FC = () => {
  const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)
  const spawnedObjects = getObjectList()
  // const spawnedObjects: Entity[] = []
  
  const ObjectList = spawnedObjects?.map((entity: Entity, index: any) => (
    <Accordion.Item value={index.toString()}>
      <Accordion.Control>
        <Text size="sm" weight={500}>{index+1} - {entity.name}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Text size="xs">Object infos</Text>
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
            onClick={() => {
              console.log('Spawn object!')
            }}
          >
            <MdLibraryAdd fontSize={30} />
          </ActionIcon>
        </Group>

        <Space h='sm' />

        <ScrollArea style={{ height: 200 }} scrollbarSize={12}>
          <Accordion variant="separated" radius="sm" value={currentAccordionItem} onChange={setAccordionItem} chevronPosition="left">
            {ObjectList[0] ? ObjectList : 
              <Paper p="md">
                <Text size="md" weight={600} color="red.4">No spawned object</Text>
              </Paper>
            }
          </Accordion>
        </ScrollArea>
      </Paper>
    </>
  )
}
  
export default ObjectSpawner