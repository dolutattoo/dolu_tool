import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Transition, Center, Pagination } from "@mantine/core"
import { useEffect, useState} from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { usePedList, changePed, getSearchPedInput, pedListPageCountAtom, getPedListPageCount, pedListActivePageAtom } from "../../../../atoms/ped"
import { displayImageAtom, imagePathAtom } from "../../../../atoms/imgPreview"
import { setClipboard } from '../../../../utils/setClipboard'
import PedSearch from "./components/pedListSearch"

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
  const pages = createPages(pedLists, 5)
  const pageCount = getPedListPageCount()
  const [activePage, setPage] = useRecoilState(pedListActivePageAtom)

  const [copiedPedName, setCopiedPedName] = useState(false);
  const [copiedPedHash, setCopiedPedHash] = useState(false);
  const [currentAccordionItem, setAccordionItem] = useState<string|null>('0')

  const displayImage = useSetRecoilState(displayImageAtom)
  const imagePath = useSetRecoilState(imagePathAtom)


  // const [displayImage, setDisplayImage] = useState<boolean>(true)
  // const [imagePath, setImagePath] = useState<string>("")

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
      <Accordion.Item value={index.toString()}>
        <Accordion.Control>
          <Text size="md" weight={500}>• {pedList.name}</Text>
          <Text size="xs">Hash: {pedList.hash}</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Group grow spacing="xs"> 
            <Image
              onMouseEnter={() => {
                displayImage(true);
                imagePath(`https://cfx-nui-DoluMappingTool/shared/img/${pedList.name}.webp`)
              }}
              onMouseLeave={() => {displayImage(false)}}
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
  ))

  return(
    <>
      <Paper p="md">
        <Stack>
          <Text size={20}>Ped Changer</Text>
          <Button
            uppercase
            variant="outline"
            color="blue.4"
            onClick={() => { changePed({ name: `${searchPedValue}` }) }}
          >
            Change by Name
          </Button>
          <PedSearch/>
          <ScrollArea style={{ height: 516 }} scrollbarSize={0}>
            <Stack>
              <Accordion variant="contained" radius="sm" value={currentAccordionItem} onChange={setAccordionItem}>
                {PedList ? PedList : 
                  <Paper p="md">
                    <Text size="md" weight={600} color="red.4">No location found</Text>
                  </Paper>
                }
               </Accordion>
            </Stack>
          </ScrollArea>
          <Center>
            <Pagination
              color="blue.4"
              size='sm'
              page={activePage}
              onChange={(value) => {
                setPage(value)
                setAccordionItem("0")
              }}
              total={pageCount}
            />
          </Center>
        </Stack>
      </Paper>
    </>
  )

}

export default Ped