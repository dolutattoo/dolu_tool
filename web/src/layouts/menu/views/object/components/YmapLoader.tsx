import { Text, Group, Paper, ActionIcon, Space, ScrollArea, Accordion } from "@mantine/core"
import { openModal } from "@mantine/modals"
import { useState } from "react"
import { MdLibraryAdd } from "react-icons/md"
import LoadYmap from "./modals/LoadYmap"

const YmapLoader: React.FC = () => {
  const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)
  const ymapList: any = []

  return (
    <>
      <Paper p="md">
        <Group position='apart'>
          <Text size={20} weight={600}>YMAP Loader</Text>

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

        <ScrollArea style={{ height: 200 }} offsetScrollbars scrollbarSize={12}>
          <Accordion variant="separated" radius="sm" value={currentAccordionItem} onChange={setAccordionItem} chevronPosition="left">
            {ymapList[0] ? ymapList : 
              <Paper p="md">
                <Text size="md" weight={400} color="red.4">No ymap loaded</Text>
              </Paper>
            }
          </Accordion>
        </ScrollArea>
      </Paper>
    </>
  )
}

export default YmapLoader