import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Center, Pagination } from "@mantine/core"
import { useEffect, useState} from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { getSearchPedInput, PedProp, pedsActivePageAtom, pedsPageContentAtom, pedsPageCountAtom } from "../../../../atoms/ped"
import { displayImageAtom, imagePathAtom } from "../../../../atoms/imgPreview"
import { setClipboard } from '../../../../utils/setClipboard'
import PedSearch from "./components/pedListSearch"
import { fetchNui } from "../../../../utils/fetchNui"
import { useNuiEvent } from "../../../../hooks/useNuiEvent"

const Ped: React.FC = () => {
  const searchPedValue = getSearchPedInput()
  const [pageContent, setPageContent] = useRecoilState(pedsPageContentAtom)
  const [pageCount, setPageCount] = useRecoilState(pedsPageCountAtom)
  const [activePage, setPage] = useRecoilState(pedsActivePageAtom)

  useNuiEvent('setPageContent', (data: {type: string, content: PedProp[], maxPages: number}) => {
    if (data.type === 'peds') {
      setPageContent(data.content)
      setPageCount(data.maxPages)
    }
  })

  const [copiedPedName, setCopiedPedName] = useState(false);
  const [copiedPedHash, setCopiedPedHash] = useState(false);
  const [currentAccordionItem, setAccordionItem] = useState<string|null>('0')

  const displayImage = useSetRecoilState(displayImageAtom)
  const imagePath = useSetRecoilState(imagePathAtom)

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

  const PedList = pageContent?.map((pedList: any, index: number) => (
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
                imagePath(`https://cfx-nui-dolu_tool/shared/img/ped/${pedList.name}.webp`)
              }}
              onMouseLeave={() => {displayImage(false)}}
              height={50}
              fit="contain"
              alt={`${pedList.name}`}
              src={`https://cfx-nui-dolu_tool/shared/img/ped/${pedList.name}.webp`}
              withPlaceholder={true}
              sx={{
                '&:hover':{
                  borderRadius: '5px',
                  backgroundColor: 'rgba(35, 35, 35, 0.75)'
                }
              }}
            />
            <Button
              variant='light'
              color={"blue.4"}
              size="xs"
              onClick={() => { fetchNui('dolu_tool:changePed', { name: pedList.name, hash: pedList.hash }) }}
            >
              Set Ped
            </Button>
            <Button
              variant='light'
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
              variant='light'
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
    <Stack>
      <Text size={20}>Peds</Text>
      <Button
        uppercase
        variant='light'
        color="blue.4"
        onClick={() => { fetchNui('dolu_tool:changePed', { name: `${searchPedValue}` }) }}
      >
        Set by Name
      </Button>
      <PedSearch/>
      <ScrollArea style={{ height: 516 }} scrollbarSize={0}>
        <Stack>
          <Accordion variant="contained" radius="sm" value={currentAccordionItem} onChange={setAccordionItem}>
            {PedList ? PedList : 
              <Paper p="md">
                <Text size="md" weight={600} color="red.4">No ped found</Text>
              </Paper>
            }
            </Accordion>
        </Stack>
      </ScrollArea>
      <Center>
        <Pagination
          color="blue.4"
          size='md'
          page={activePage}
          onChange={(value) => {
            fetchNui('dolu_tool:loadPages', { type: 'peds', activePage: value, filter: searchPedValue })
            setPage(value)
            setAccordionItem("0")
          }}
          total={pageCount}
        />
      </Center>
    </Stack>
  )

}

export default Ped