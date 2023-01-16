import { Accordion, Badge, Button, Center, Checkbox, Group, Pagination, Paper, Stack, Text } from '@mantine/core'
import { openModal } from '@mantine/modals'
import CreateLocation from './components/modals/CreateLocation'
import { Location, getSearchLocationInput, locationsActivePageAtom, locationCustomFilterAtom, locationsPageCountAtom, locationVanillaFilterAtom, locationsPageContentAtom } from '../../../../atoms/location'
import LocationSearch from './components/LocationSearch'
import { setClipboard } from '../../../../utils/setClipboard'
import { useEffect, useState } from 'react'
import RenameLocation from './components/modals/RenameLocation'
import { useRecoilState } from 'recoil'
import { fetchNui } from '../../../../utils/fetchNui'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import DeleteLocation from './components/modals/DeleteLocation'

const Locations: React.FC = () => {
  const searchLocationValue = getSearchLocationInput()
  const [pageContent, setPageContent] = useRecoilState(locationsPageContentAtom)
  const [pageCount, setPageCount] = useRecoilState(locationsPageCountAtom)
  const [activePage, setPage] = useRecoilState(locationsActivePageAtom)

  useNuiEvent('setPageContent', (data: {type: string, content: Location[], maxPages: number}) => {
    if (data.type === 'locations') {
      setPageContent(data.content)
      setPageCount(data.maxPages)
    }
  })

  // Checkboxes
  const [checkedVanilla, setCheckedVanilla] = useRecoilState(locationVanillaFilterAtom)
  const [checkedCustom, setCheckedCustom] = useRecoilState(locationCustomFilterAtom)

  // Accordion
  const [currentAccordionItem, setAccordionItem] = useState<string|null>('0')

  // Copied button
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      if (copied) setCopied(false)
    }, 2000)
  }, [copied, setCopied])

  const Locationlist = pageContent?.map((location: any, index: number) => (
      <Accordion.Item value={index.toString()}>
        <Accordion.Control>
          <Stack spacing={0}>
            <Group position='apart'>
              <Text color="blue.4" size="md" weight={500}>{location.name}</Text>
              <Badge color={location.custom ? "green.4" : "blue.4"}>{location.custom ? "Custom" : "Vanilla"}</Badge>
            </Group>
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
                fetchNui('dolu_tool:teleport', { name: location.name, x: location.x, y: location.y, z: location.z, heading: location.heading })
              }
            >
              Teleport
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
            {location.custom &&
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
            }
            {location.custom &&
              <Button
                variant="outline"
                color="blue.4"
                size="xs"
                onClick={() => {
                  openModal({
                    title: 'Delete this location?',
                    children: <DeleteLocation name={location.name} />,
                    size: 'xs',
                  })
                  setAccordionItem(null)
                }}
              >
                Delete
              </Button>
            }
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
  ))

  return (
    <>
      <Stack>
        <Text size={20}>Locations</Text>
        <Group grow>            
          <Checkbox
            label='Show custom locations'
            size='sm'
            color="blue.4"
            disabled={!checkedVanilla}
            checked={checkedCustom}
            onChange={(e) => {
              fetchNui('dolu_tool:loadPages', { type: 'locations', activePage: 1, filter: searchLocationValue, checkboxes: {vanilla: checkedVanilla, custom: e.currentTarget.checked} })
              setPage(1)
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
              fetchNui('dolu_tool:loadPages', { type: 'locations', activePage: 1, filter: searchLocationValue, checkboxes: {vanilla: e.currentTarget.checked, custom: checkedCustom} })
              setPage(1)
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
          Create Custom Location
        </Button>
        
        <LocationSearch />

        {/* <ScrollArea style={{ height: 480 }} scrollbarSize={0}> */}
          <Stack>
            <Accordion chevronPosition="left" variant="contained" radius="sm" value={currentAccordionItem} onChange={setAccordionItem}>
              {Locationlist ? Locationlist :
                <Paper p="md">
                  <Text size="md" weight={600} color="red.4">No location found</Text>
                </Paper>
              }
            </Accordion>
          </Stack>
        {/* </ScrollArea> */}
        <Center>
          <Pagination
            color="blue.4"
            size='sm'
            page={activePage}
            onChange={(value) => {
              fetchNui('dolu_tool:loadPages', { type: 'locations', activePage: value, filter: searchLocationValue, checkboxes: {vanilla: checkedVanilla, custom: checkedCustom} })
              setPage(value)
              setAccordionItem("0")
            }}
            total={pageCount}
          />
        </Center>
      </Stack>
    </>
  )
}

export default Locations
