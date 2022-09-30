import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Transition } from "@mantine/core"
import { useEffect, useState } from "react";
import { usePedList, changePed, getSearchPedInput } from "../../../../atoms/ped";
import { setClipboard } from '../../../../utils/setClipboard'
import PedSearch from "./components/pedListSearch";

const Ped: React.FC = () => {
  const pedLists = usePedList()
  const searchPedValue = getSearchPedInput() as string

  const [copiedPedName, setCopiedPedName] = useState(false);
  const [copiedPedHash, setCopiedPedHash] = useState(false);
  const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)

  const [displayImage, setDisplayImage] = useState<boolean>(false)
  const [imagePath, setImagePath] = useState<string>("")

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
      <Transition transition="slide-right" mounted={displayImage}>
        {(style) => (
          <Paper
            radius="md"
            p="md"
            shadow="xs"
            style={style}
            sx={{
              position: 'absolute',
              top: '0%',
              left: '46.87%',
            }}
          >
            <Image
              height={300}
              fit="contain"
              alt={"Display selected image"}
              src={imagePath}
              withPlaceholder={true}
            />
          </Paper>
        )}
      </Transition>
      <Paper p="md">
        <Stack>
          <PedSearch/>
          <Button
            uppercase
            variant="outline"
            color="blue.4"
            onClick={() => { changePed({ name: `${searchPedValue}` }) }}
          >
            Change by Name
          </Button>
          <ScrollArea style={{ height: 555 }} scrollbarSize={0}>
            <Stack>
              {pedLists.map((pedList, index) => (
                <Accordion value={currentAccordionItem} onChange={setAccordionItem}>
                  <Accordion.Item value={index.toString()}>
                    <Accordion.Control>
                      <Text size="sm">{pedList.name}</Text>
                      <Text size="xs">Hash: {pedList.hash}</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Group grow spacing="xs"> 
                        <Image
                          onMouseEnter={() => {
                            setDisplayImage(true);
                            setImagePath(`https://cfx-nui-DoluMappingTool/shared/img/${pedList.name}.webp`)
                          }}
                          onMouseLeave={() => {setDisplayImage(false)}}
                          height={50}
                          fit="contain"
                          alt={`${pedList.name}`}
                          src={`https://cfx-nui-DoluMappingTool/shared/img/${pedList.name}.webp`}
                          withPlaceholder={true}
                          sx={{
                            '&:hover':{
                              borderRadius: '5px',
                              backgroundColor: 'rgba(35, 35, 35, 0.75)'
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          color={"blue.4"}
                          size="xs"
                          onClick={() => { changePed({ name: pedList.name, hash: pedList.hash }) }}
                        >
                          Change Ped
                        </Button>
                        <Button
                          variant="outline"
                          color={copiedPedName ? 'teal' : "blue.4"}
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
                          color={copiedPedHash ? 'teal' : "blue.4"}
                          size="xs"
                          onClick={() => {
                            setClipboard(pedList.hash ? `${pedList.hash}` : '');
                            setCopiedPedHash(true);
                          }}
                        >
                          {copiedPedHash ? 'Copied' : 'Copy'} Hash
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