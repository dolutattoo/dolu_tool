import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, SimpleGrid } from "@mantine/core"
import { useEffect, useState } from "react";
import { usePedList, changePed, getSearchPedInput } from "../../../../atoms/ped";
import { setClipboard } from '../../../../utils/setClipboard'
import PedSearch from "./components/pedListSearch";

const Ped: React.FC = () => {
  const pedLists = usePedList()

  const [copiedPedName, setCopiedPedName] = useState(false);
  const [copiedPedHash, setCopiedPedHash] = useState(false);
  const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)

  useEffect(() => {
    setTimeout(() => {
      if (copiedPedName) setCopiedPedName(false);
    }, 1000);
  }, [copiedPedName, setCopiedPedName]);

  useEffect(() => {
    setTimeout(() => {
      if (copiedPedHash) setCopiedPedHash(false);
    }, 1000);
  }, [copiedPedHash, setCopiedPedHash]);

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
                        <Image
                          height={200}
                          fit="contain"
                          alt={`${pedList.name}`}
                          src={`nui://DoluMappingTool/shared/img/${pedList.name}.webp`}
                        />
                        <SimpleGrid cols={2}>
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
                          <Button
                            variant="outline"
                            color='orange'
                            size="xs"
                            onClick={() => {}}
                          >
                            Set Default
                          </Button>
                          <Button
                            variant="outline"
                            color={copiedPedHash ? 'teal' : 'orange'}
                            size="xs"
                            onClick={() => {
                              setClipboard(pedList.hash ? `${pedList.hash}` : '');
                              setCopiedPedHash(true);
                            }}
                          >
                            {copiedPedHash ? 'Copied' : 'Copy'} Hash
                          </Button>
                        </SimpleGrid>                        
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