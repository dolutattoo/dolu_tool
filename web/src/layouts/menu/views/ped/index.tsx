import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Transition, Center, Pagination } from "@mantine/core"
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { usePedList, changePed, getSearchPedInput, pedListPageCountAtom, getPedListPageCount, pedListActivePageAtom } from "../../../../atoms/ped";
import { setClipboard } from '../../../../utils/setClipboard'
import PedSearch from "./components/pedListSearch";

const Ped: React.FC = () => {
  // Get Peds (depending on search bar value)
  const pedLists = usePedList()
  // Get search bar value (used for change ped by name)
  const searchPedValue = getSearchPedInput()

  const createPages = (arr: any, size: number) => {
    const setPageCount = useSetRecoilState(pedListPageCountAtom)
    var result = []
    var pageCount = -1
    for (var i = size*-1; i < arr.length; i += size) {
      if (i < arr.length) { pageCount += 1 }
      result.push(arr.slice(i, i+size))
    }
    setPageCount(pageCount)
    return result
  }
  const pages = createPages(pedLists, 6)
  const pageCount = getPedListPageCount()
  const [activePage, setPage] = useRecoilState(pedListActivePageAtom)

  const setActivePage = useSetRecoilState(pedListActivePageAtom)

  const [copiedPedName, setCopiedPedName] = useState(false);
  const [copiedPedHash, setCopiedPedHash] = useState(false);
  const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)

  const [displayImage, setDisplayImage] = useState<boolean>(false)
  const [imagePath, setImagePath] = useState<string>("")

  // Copied name button
  useEffect(() => {
    setTimeout(() => {
      if (copiedPedName) setCopiedPedName(false);
    }, 1000);
  }, [copiedPedName, setCopiedPedName]);
  // Copied hash button
  useEffect(() => {
    setTimeout(() => {
      if (copiedPedHash) setCopiedPedHash(false);
    }, 1000);
  }, [copiedPedHash, setCopiedPedHash]);

  const PedList = pages[activePage]?.map((pedList: any, index: number) => (
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
  ))

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
              {PedList ? PedList : 
                <Paper p="md">
                  <Text size="md" weight={600} color="red.4">No location found</Text>
                </Paper>
              }
            </Stack>
          </ScrollArea>
          <Center>
            <Pagination
              color="blue.4"
              size='sm'
              page={activePage}
              onChange={setPage}
              total={pageCount}
            />
          </Center>
        </Stack>
      </Paper>
    </>
  )

}

export default Ped