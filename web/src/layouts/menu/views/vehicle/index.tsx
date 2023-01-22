import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Center, Pagination, Tabs, Space } from '@mantine/core'
import { useEffect, useState} from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { getSearchVehicleInput, vehiclesPageCountAtom, vehiclesActivePageAtom, vehiclesPageContentAtom, VehicleProp, vehiclesTabAtom } from '../../../../atoms/vehicle'
import { displayImageAtom, imagePathAtom } from '../../../../atoms/imgPreview'
import { setClipboard } from '../../../../utils/setClipboard'
import VehicleSearch from './components/vehicleListSearch'
import VehicleCustoms from './components/vehicleCustoms'
import Stancer from './components/vehicleStancer'
import { fetchNui } from '../../../../utils/fetchNui'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import { useLocales } from '../../../../providers/LocaleProvider'
import { TbSearch } from 'react-icons/tb'
import { GiSpring } from 'react-icons/gi'
import { MdTune } from 'react-icons/md'
import { FaSave } from 'react-icons/fa'
import { BiSprayCan } from 'react-icons/bi'

const Vehicle: React.FC = () => {
  const { locale } = useLocales()
  const searchVehicleValue = getSearchVehicleInput()
  const [pageContent, setPageContent] = useRecoilState(vehiclesPageContentAtom)
  const [pageCount, setPageCount] = useRecoilState(vehiclesPageCountAtom)
  const [activePage, setPage] = useRecoilState(vehiclesActivePageAtom)
  const [vehicleTab, setVehicleTab] = useRecoilState(vehiclesTabAtom)

  useNuiEvent('setPageContent', (data: {type: string, content: VehicleProp[], maxPages: number}) => {
    if (data.type === 'vehicles') {
      setPageContent(data.content)
      setPageCount(data.maxPages)
    }
  })

  const [copiedVehicleName, setCopiedVehicleName] = useState(false)
  const [copiedVehicleHash, setCopiedVehicleHash] = useState(false)
  const [currentAccordionItem, setAccordionItem] = useState<string|null>('0')

  const displayImage = useSetRecoilState(displayImageAtom)
  const imagePath = useSetRecoilState(imagePathAtom)

  // On tab change
  useEffect(() => {
    fetchNui('dmt:setVehicleTab', vehicleTab)
  }, [vehicleTab])

  // Copied name button
  useEffect(() => {
    setTimeout(() => {
      setCopiedVehicleName(false)
    }, 1000)
  }, [copiedVehicleName])

  // Copied hash button
  useEffect(() => {
    setTimeout(() => {
      setCopiedVehicleHash(false)
    }, 1000)
  }, [copiedVehicleHash])

  const VehicleList = pageContent?.map((vehicleList: any, index: number) => (
      <Accordion.Item key={index} value={index.toString()}>
        <Accordion.Control>
          <Text size='md' weight={500}>• {vehicleList.name}</Text>
          <Text size='xs'>{locale.ui_hash}: {vehicleList.hash}</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Group grow spacing='xs'> 
            <Image
              onMouseEnter={() => {
                displayImage(true)
                imagePath(`nui://dolu_tool/shared/img/vehicle/${vehicleList.name}.webp`)
              }}
              onMouseLeave={() => {displayImage(false)}}
              height={50}
              fit='contain'
              alt={`${vehicleList.name}`}
              src={`nui://dolu_tool/shared/img/vehicle/${vehicleList.name}.webp`}
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
              color={'blue.4'}
              size='xs'
              onClick={() => fetchNui('dolu_tool:spawnVehicle', vehicleList.name)}
            >
              {locale.ui_spawn}
            </Button>
            <Button
              variant='light'
              color={copiedVehicleName ? 'teal' : 'blue.4'}
              size='xs'
              onClick={() => {
                setClipboard(vehicleList.name)
                setCopiedVehicleName(true)
              }}
            >
              {copiedVehicleName ? locale.ui_copied_name : locale.ui_copy_name}
            </Button>
            <Button
              variant='light'
              color={copiedVehicleHash ? 'teal' : 'blue.4'}
              size='xs'
              onClick={() => {
                setClipboard(vehicleList.hash ? `${vehicleList.hash}` : '')
                setCopiedVehicleHash(true)
              }}
            >
              {copiedVehicleHash ? locale.ui_copied_hash : locale.ui_copy_hash}
            </Button>                     
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
  ))

  return(
    <Stack>
      <Text size={20}>{locale.ui_vehicles}</Text>
      <Tabs radius='md' value={vehicleTab} onTabChange={setVehicleTab}>
        <Tabs.List>
          <Tabs.Tab value='search' icon={<TbSearch size={14} />}>Search</Tabs.Tab>
          <Tabs.Tab value='custom' icon={<BiSprayCan size={14} />}>Custom</Tabs.Tab>
          <Tabs.Tab value='stancer' icon={<GiSpring size={14} />}>Stance</Tabs.Tab>
          <Tabs.Tab value='handling' icon={<MdTune size={14} />}>Handling</Tabs.Tab>
          <Tabs.Tab value='saves' icon={<FaSave size={14} />}>Saves</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='search' pt='md'>
          <Group grow>
            <VehicleSearch/>
            <Button
              disabled={searchVehicleValue === ''}
              uppercase
              variant='light'
              color='blue.4'
              onClick={() => fetchNui('dolu_tool:spawnVehicle', searchVehicleValue)}
            >
              {locale.ui_spawn_by_name}
            </Button>
          </Group>

          <Space h='md' />

          <ScrollArea style={{ height: 529, borderRadius: '5px' }} scrollbarSize={0}>
            <Stack>
              <Accordion variant='contained' radius='sm' value={currentAccordionItem} onChange={setAccordionItem}>
                {VehicleList ? VehicleList : 
                  <Paper p='md'>
                    <Text size='md' weight={600} color='red.4'>No vehicle found</Text>
                  </Paper>
                }
                </Accordion>
            </Stack>
          </ScrollArea>

          <Space h='xs' />

          <Center>
            <Pagination
              color='blue.4'
              size='sm'
              page={activePage}
              onChange={(value) => {
                fetchNui('dolu_tool:loadPages', { type: 'vehicles', activePage: value, filter: searchVehicleValue })
                setPage(value)
                setAccordionItem('0')
              }}
              total={pageCount}
            />
          </Center>
        </Tabs.Panel>

        <Tabs.Panel value='custom' pt='xs'>
            <VehicleCustoms />
        </Tabs.Panel>

        <Tabs.Panel value='stancer' pt='xs'>
            <Stancer />
        </Tabs.Panel>

        <Tabs.Panel value='handling' pt='xs'>
            Handling tab!
        </Tabs.Panel>

        <Tabs.Panel value='saves' pt='xs'>
            Saves tab!
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )

}

export default Vehicle