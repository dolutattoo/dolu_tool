import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Transition, Center, Pagination } from "@mantine/core"
import { useEffect, useState} from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { useVehicleList, changeVehicle, getSearchVehicleInput, vehicleListPageCountAtom, getVehicleListPageCount, vehicleListActivePageAtom } from "../../../../atoms/vehicle"
import { displayImageAtom, imagePathAtom } from "../../../../atoms/imgPreview"
import { setClipboard } from '../../../../utils/setClipboard'
import VehicleSearch from "./components/vehicleListSearch"
import { fetchNui } from "../../../../utils/fetchNui"

const Vehicle: React.FC = () => {
  // Get Vehicles (depending on search bar value)
  const vehicleLists = useVehicleList()
  // Get search bar value (used for change vehicle by name)
  const searchVehicleValue = getSearchVehicleInput()

  const createPages = (arr: any, size: number) => {
    const setPageCount = useSetRecoilState(vehicleListPageCountAtom)
    var result = []
    var pageCount = -1
    for (var i = size*-1; i < arr.length; i += size) {
      if (i < arr.length) { pageCount += 1 }
      result.push(arr.slice(i, i+size))
    }
    setPageCount(pageCount)
    return result
  }
  const pages = createPages(vehicleLists, 5)
  const pageCount = getVehicleListPageCount()
  const [activePage, setPage] = useRecoilState(vehicleListActivePageAtom)

  const [copiedVehicleName, setCopiedVehicleName] = useState(false);
  const [copiedVehicleHash, setCopiedVehicleHash] = useState(false);
  const [currentAccordionItem, setAccordionItem] = useState<string|null>('0')

  const displayImage = useSetRecoilState(displayImageAtom)
  const imagePath = useSetRecoilState(imagePathAtom)

  // Copied name button
  useEffect(() => {
    setTimeout(() => {
      if (copiedVehicleName) setCopiedVehicleName(false);
    }, 1000);
  }, [copiedVehicleName, setCopiedVehicleName]);
  // Copied hash button
  useEffect(() => {
    setTimeout(() => {
      if (copiedVehicleHash) setCopiedVehicleHash(false);
    }, 1000);
  }, [copiedVehicleHash, setCopiedVehicleHash]);

  const VehicleList = pages[activePage]?.map((vehicleList: any, index: number) => (
      <Accordion.Item value={index.toString()}>
        <Accordion.Control>
          <Text size="md" weight={500}>• {vehicleList.name}</Text>
          <Text size="xs">Hash: {vehicleList.hash}</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Group grow spacing="xs"> 
            <Image
              onMouseEnter={() => {
                displayImage(true);
                imagePath(`https://cfx-nui-DoluMappingTool/shared/img/vehicle/${vehicleList.name}.webp`)
              }}
              onMouseLeave={() => {displayImage(false)}}
              height={50}
              fit="contain"
              alt={`${vehicleList.name}`}
              src={`https://cfx-nui-DoluMappingTool/shared/img/vehicle/${vehicleList.name}.webp`}
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
              onClick={() => fetchNui('dmt:spawnVehicle', vehicleList.name)}
            >
              Spawn Vehicle
            </Button>
            <Button
              variant="outline"
              color={copiedVehicleName ? 'teal' : "blue.4"}
              size="xs"
              onClick={() => {
                setClipboard(vehicleList.name);
                setCopiedVehicleName(true);
              }}
            >
              {copiedVehicleName ? 'Copied' : 'Copy'} Name
            </Button>
            <Button
              variant="outline"
              color={copiedVehicleHash ? 'teal' : "blue.4"}
              size="xs"
              onClick={() => {
                setClipboard(vehicleList.hash ? `${vehicleList.hash}` : '');
                setCopiedVehicleHash(true);
              }}
            >
              {copiedVehicleHash ? 'Copied' : 'Copy'} Hash
            </Button>                     
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
  ))

  return(
    <Paper p="md">
      <Stack>
        <Text size={20}>Vehicle</Text>
        <Button
          uppercase
          variant="outline"
          color="blue.4"
          onClick={() => fetchNui('dmt:spawnVehicle', searchVehicleValue)}
        >
          Spawn by Name
        </Button>
        <VehicleSearch/>
        <ScrollArea style={{ height: 516 }} scrollbarSize={0}>
          <Stack>
            <Accordion variant="contained" radius="sm" value={currentAccordionItem} onChange={setAccordionItem}>
              {VehicleList ? VehicleList : 
                <Paper p="md">
                  <Text size="md" weight={600} color="red.4">No vehicle found</Text>
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

export default Vehicle