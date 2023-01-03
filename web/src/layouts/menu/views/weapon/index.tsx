import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Transition, Center, Pagination } from "@mantine/core"
import { useEffect, useState} from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { useWeaponList, getSearchWeaponInput, weaponListPageCountAtom, getWeaponListPageCount, weaponListActivePageAtom } from "../../../../atoms/weapon"
import { displayImageAtom, imagePathAtom } from "../../../../atoms/imgPreview"
import { setClipboard } from '../../../../utils/setClipboard'
import WeaponSearch from "./components/weaponListSearch"
import { fetchNui } from "../../../../utils/fetchNui"

const Weapon: React.FC = () => {
  // Get Weapons (depending on search bar value)
  const weaponLists = useWeaponList()
  // Get search bar value (used for give weapon by name)
  const searchWeaponValue = getSearchWeaponInput()

  const createPages = (arr: any, size: number) => {
    const setPageCount = useSetRecoilState(weaponListPageCountAtom)
    var result = []
    var pageCount = -1
    for (var i = size*-1; i < arr.length; i += size) {
      if (i < arr.length) { pageCount += 1 }
      result.push(arr.slice(i, i+size))
    }
    setPageCount(pageCount)
    return result
  }
  const pages = createPages(weaponLists, 5)
  const pageCount = getWeaponListPageCount()
  const [activePage, setPage] = useRecoilState(weaponListActivePageAtom)

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

  const WeaponList = pages[activePage]?.map((weaponList: any, index: number) => (
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
                imagePath(`https://cfx-nui-DoluMappingTool/shared/img/weapon/${weaponList.name}.png`)
              }}
              onMouseLeave={() => {displayImage(false)}}
              height={50}
              fit="contain"
              alt={`${weaponList.name}`}
              src={`https://cfx-nui-DoluMappingTool/shared/img/weapon/${weaponList.name}.png`}
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
              onClick={() => fetchNui('dmt:giveWeapon', weaponList.name)}
            >
              Give Weapon
            </Button>
            <Button
              variant="outline"
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
              variant="outline"
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
    <Paper p="md">
      <Stack>
        <Text size={20}>Weapon</Text>
        <Button
          uppercase
          variant="outline"
          color="blue.4"
          onClick={() => fetchNui('dmt:giveWeapon', searchWeaponValue)}
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
              setPage(value)
              setAccordionItem("0")
            }}
            total={pageCount}
          />
        </Center>
      </Stack>
    </Paper>
  )

}

export default Weapon