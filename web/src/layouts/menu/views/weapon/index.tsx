import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Center, Pagination } from "@mantine/core"
import { useEffect, useState} from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { getSearchWeaponInput, weaponsPageCountAtom, weaponsActivePageAtom, weaponsPageContentAtom, WeaponProp } from "../../../../atoms/weapon"
import { displayImageAtom, imagePathAtom } from "../../../../atoms/imgPreview"
import { setClipboard } from '../../../../utils/setClipboard'
import WeaponSearch from "./components/weaponListSearch"
import { fetchNui } from "../../../../utils/fetchNui"
import { useNuiEvent } from "../../../../hooks/useNuiEvent"

const Weapon: React.FC = () => {
  const searchWeaponValue = getSearchWeaponInput()
  const [pageContent, setPageContent] = useRecoilState(weaponsPageContentAtom)
  const [pageCount, setPageCount] = useRecoilState(weaponsPageCountAtom)
  const [activePage, setPage] = useRecoilState(weaponsActivePageAtom)

  useNuiEvent('setPageContent', (data: {type: string, content: WeaponProp[], maxPages: number}) => {
    if (data.type === 'weapons') {
      setPageContent(data.content)
      setPageCount(data.maxPages)
    }
  })

  const [copiedWeaponName, setCopiedWeaponName] = useState(false);
  const [copiedWeaponHash, setCopiedWeaponHash] = useState(false);
  const [currentAccordionItem, setAccordionItem] = useState<string|null>('0')

  const displayImage = useSetRecoilState(displayImageAtom)
  const imagePath = useSetRecoilState(imagePathAtom)

  // Copied name button
  useEffect(() => {
    setTimeout(() => {
      if (copiedWeaponName) setCopiedWeaponName(false);
    }, 1000);
  }, [copiedWeaponName, setCopiedWeaponName]);
  // Copied hash button
  useEffect(() => {
    setTimeout(() => {
      if (copiedWeaponHash) setCopiedWeaponHash(false);
    }, 1000);
  }, [copiedWeaponHash, setCopiedWeaponHash]);

  const WeaponList = pageContent?.map((weaponList: any, index: number) => (
      <Accordion.Item value={index.toString()}>
        <Accordion.Control>
          <Text size="md" weight={500}>• {weaponList.name}</Text>
          <Text size="xs">Hash: {weaponList.hash}</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Group grow spacing="xs"> 
            <Image
              onMouseEnter={() => {
                displayImage(true);
                imagePath(`https://cfx-nui-dolu_tool/shared/img/weapon/${weaponList.name}.png`)
              }}
              onMouseLeave={() => {displayImage(false)}}
              height={50}
              fit="contain"
              alt={`${weaponList.name}`}
              src={`https://cfx-nui-dolu_tool/shared/img/weapon/${weaponList.name}.png`}
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
              onClick={() => fetchNui('dolu_tool:giveWeapon', weaponList.name)}
            >
              Give Weapon
            </Button>
            <Button
              variant='light'
              color={copiedWeaponName ? 'teal' : "blue.4"}
              size="xs"
              onClick={() => {
                setClipboard(weaponList.name);
                setCopiedWeaponName(true);
              }}
            >
              {copiedWeaponName ? 'Copied' : 'Copy'} Name
            </Button>
            <Button
              variant='light'
              color={copiedWeaponHash ? 'teal' : "blue.4"}
              size="xs"
              onClick={() => {
                setClipboard(weaponList.hash ? `${weaponList.hash}` : '');
                setCopiedWeaponHash(true);
              }}
            >
              {copiedWeaponHash ? 'Copied' : 'Copy'} Hash
            </Button>                     
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
  ))

  return(
    <Stack>
      <Text size={20}>Weapons</Text>
      <Button
        uppercase
        variant='light'
        color="blue.4"
        onClick={() => fetchNui('dolu_tool:giveWeapon', searchWeaponValue)}
      >
        Give by Name
      </Button>
      <WeaponSearch/>
      <ScrollArea style={{ height: 516 }} scrollbarSize={0}>
        <Stack>
          <Accordion variant="contained" radius="sm" value={currentAccordionItem} onChange={setAccordionItem}>
            {WeaponList ? WeaponList : 
              <Paper p="md">
                <Text size="md" weight={600} color="red.4">No weapon found</Text>
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
            fetchNui('dolu_tool:loadPages', { type: 'weapons', activePage: value, filter: searchWeaponValue })
            setPage(value)
            setAccordionItem("0")
          }}
          total={pageCount}
        />
      </Center>
    </Stack>
  )

}

export default Weapon