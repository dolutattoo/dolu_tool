import { Accordion, Button, Group, ScrollArea, Stack, Text } from "@mantine/core"
import { useEffect, useState } from "react";
import { usePedList, changePed } from "../../../../atoms/ped";
import { setClipboard } from '../../../../utils/setClipboard'
import PedSearch from "./components/pedListSearch";

const Ped: React.FC = () => {
  const pedLists = usePedList()

  const [copiedPedName, setCopiedPedName] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (copiedPedName) setCopiedPedName(false);
    }, 2000);
  }, [copiedPedName, setCopiedPedName]);

  const [changedPed, setChangedPed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (changedPed) setChangedPed(false);
    }, 2000);
  }, [changedPed, setChangedPed]);

  return(
    <>
      <ScrollArea style={{ height: 555 }} scrollbarSize={0}>
        <Stack>
          <PedSearch/>
          {pedLists.map((pedList, index) =>(
            <Accordion>
              <Accordion.Item value={pedList.name}>
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
                      color={changedPed ? 'teal' : 'orange'}
                      size="xs"
                      onClick={() => {
                        changePed({ name: pedList.name, hash: pedList.hash })
                        setChangedPed(true);
                      }}
                    >
                      {changedPed ? 'Changed' : 'Change'} Ped
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
    </>
  )

}

export default Ped