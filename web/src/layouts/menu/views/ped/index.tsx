import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text } from "@mantine/core"
import { useEffect, useState } from "react";
import { usePedList, changePed, getSearchPedInput } from "../../../../atoms/ped";
import { setClipboard } from '../../../../utils/setClipboard'
import PedSearch from "./components/pedListSearch";

const Ped: React.FC = () => {
  const pedLists = usePedList()

  const [copiedPedName, setCopiedPedName] = useState(false);
  const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)

  useEffect(() => {
    setTimeout(() => {
      if (copiedPedName) setCopiedPedName(false);
    }, 1000);
  }, [copiedPedName, setCopiedPedName]);

  return(
    <>
      <Paper p="md">
        <Stack>
          <PedSearch/>
          <Button
            uppercase
            variant="outline"
            color="orange"
            onClick={() => {
              changePed(getSearchPedInput)
            }}
          >
            Change by Name
          </Button>
          <ScrollArea style={{ height: 555 }} scrollbarSize={0}>
            <Stack>
              {pedLists.map((pedList, index) =>(
                <Accordion value={currentAccordionItem} onChange={setAccordionItem}>
                  <Accordion.Item value={index.toString()}>
                    <Accordion.Control>
                      <Stack spacing={0}>
                        <Text size="xl">{pedList.name}</Text>
                        <Text size="xs">Hash: {pedList.hash}</Text>
                      </Stack>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Group grow spacing="xs">
                        <Button
                          variant="outline"
                          color={'orange'}
                          size="xs"
                          onClick={() => {
                            changePed({ name: pedList.name, hash: pedList.hash })
                          }}
                        >
                          Change Ped
                        </Button>
                        <Button
                          variant="outline"
                          color={copiedPedName ? 'teal' : 'orange'}
                          size="xs"
                          onClick={() => {
                            setClipboard(pedList.name);
                            setCopiedPedName(true);
                          }}
                        >
                          {copiedPedName ? 'Copied' : 'Copy'} Name
                        </Button>
                      </Group>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              ))}
            </Stack>
          </ScrollArea>
        </Stack>
      </Paper>
    </>
  )

}

export default Ped