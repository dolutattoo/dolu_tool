import { Accordion, Button, Center, Checkbox, Group, Pagination, Paper, ScrollArea, Stack, Text } from '@mantine/core'
import { openModal } from '@mantine/modals'
import CreateLocation from './components/modals/CreateLocation'
import { getLocationPageCount, locationActivePageAtom, locationCustomFilterAtom, locationsAtom, locationsPageCountAtom, locationVanillaFilterAtom, useLocation } from '../../../../atoms/location'
import LocationSearch from './components/LocationSearch'
import { setClipboard } from '../../../../utils/setClipboard'
import { useEffect, useState } from 'react'
import RenameLocation from './components/modals/RenameLocation'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { fetchNui } from '../../../../utils/fetchNui'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'

const Locations: React.FC = () => {
  // Get Locations (depending on search bar value)
  const locations = useLocation()

  // Pagination
  const createPages = (arr: any, size: number) => {
    const setPageCount = useSetRecoilState(locationsPageCountAtom)
    var result = []
    var pageCount = -1
    for (var i = size*-1; i < arr.length; i += size) {
      if (i < arr.length) { pageCount += 1 }
      result.push(arr.slice(i, i+size))
    }
    setPageCount(pageCount)
    return result
  }
  const pages = createPages(locations, 5)
  const pageCount = getLocationPageCount()
  const [activePage, setPage] = useRecoilState(locationActivePageAtom)

  // Checkboxes
  const [checkedVanilla, setCheckedVanilla] = useRecoilState(locationVanillaFilterAtom)
  const [checkedCustom, setCheckedCustom] = useRecoilState(locationCustomFilterAtom)
  const setActivePage = useSetRecoilState(locationActivePageAtom)

  // Accordion
  const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)

  // Copied button
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      if (copied) setCopied(false)
    }, 2000)
  }, [copied, setCopied])

  // Get locations data updates
  const setLocations = useSetRecoilState(locationsAtom)
  useNuiEvent('setLocationDatas', (data: any) => {
    setLocations(data)
  })

  const Locationlist = pages[activePage]?.map((location: any, index: number) => (
    <Accordion value={currentAccordionItem} onChange={setAccordionItem}>
      <Accordion.Item value={index.toString()}>
        <Accordion.Control>
          <Stack spacing={0}>
            <Text size="md" weight={500}>• {location.name}</Text>
            <Text size="xs">Coords: {location.x}, {location.y}, {location.z}</Text>
          </Stack>
        </Accordion.Control>
        <Accordion.Panel>
          <Group grow spacing="xs">
            <Button
              variant="outline"
              color="blue.4"
              size="xs"
              onClick={() =>
                fetchNui('dmt:teleport', { name: location.name, x: location.x, y: location.y, z: location.z, heading: location.heading })
              }
            >
              Teleport
            </Button>
            <Button
              variant="outline"
              color="blue.4"
              size="xs"
              onClick={() => {
                openModal({
                  title: 'Rename location',
                  children: <RenameLocation defaultName={location.name} />,
                  size: 'xs',
                })
              }}
            >
              Rename
            </Button>
            <Button
              variant="outline"
              color={copied ? 'teal' : "blue.4"}
              size="xs"
              onClick={() => {
                setClipboard(location.x + ', ' + location.y + ', ' + location.z)
                setCopied(true)
              }}
            >
              {copied ? 'Copied' : 'Copy'} coords
            </Button>
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ))

  return (
    <>
      <Paper p="md">
        <Stack>
          <Text size={20}>Existing Locations</Text>
          <Group grow>            
            <Checkbox
              label='Show custom locations'
              size='sm'
              color="blue.4"
              disabled={!checkedVanilla}
              checked={checkedCustom}
              onChange={(e) => {
                setActivePage(1)
                setCheckedCustom(e.currentTarget.checked)
              }}
            />
            <Checkbox
              label='Show vanilla Interiors'
              size='sm'
              color="blue.4"
              disabled={!checkedCustom}
              checked={checkedVanilla}
              onChange={(e) => {
                setActivePage(1)
                setCheckedVanilla(e.currentTarget.checked)
              }}
            />
          </Group>
          
          <Button
            uppercase
            variant="outline"
            color="blue.4"
            onClick={() =>
              openModal({
                title: 'Create location',
                size: 'xs',
                children: <CreateLocation />,
              })
            }
          >
            Create location
          </Button>
          
          <LocationSearch />

          <ScrollArea style={{ height: 480 }} scrollbarSize={0}>
            <Stack>
              {Locationlist ? Locationlist :
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

export default Locations
