import { Accordion, Button, Center, Checkbox, Group, Pagination, Paper, ScrollArea, Stack, Text } from '@mantine/core'
import { openModal } from '@mantine/modals'
import CreateLocation from './components/modals/CreateLocation'
import { getLocationPageCount, locationActivePageAtom, locationCustomFilterAtom, locationsPageCountAtom, locationVanillaFilterAtom, teleportToLocation, useLocation } from '../../../../atoms/location'
import LocationSearch from './components/LocationSearch'
import { setClipboard } from '../../../../utils/setClipboard'
import { useEffect, useState } from 'react'
import RenameLocation from './components/modals/RenameLocation'
import { useRecoilState, useSetRecoilState } from 'recoil'

const Locations: React.FC = () => {
  const locations = useLocation()
  const pageCount = getLocationPageCount()

  const createPages = (arr: any, size: number) => {
    const setPageCount = useSetRecoilState(locationsPageCountAtom)
    var result = []
    var pageCount = 0
    for (var i = 0; i < arr.length; i += size) {
      if (i < arr.length) { pageCount += 1 }
      result.push(arr.slice(i, i+size))
    }
    setPageCount(pageCount-1)
    return result
  }

  const pages = createPages(locations, 5)

  const [checkedVanilla, setCheckedVanilla] = useRecoilState(locationVanillaFilterAtom)
  const [checkedCustom, setCheckedCustom] = useRecoilState(locationCustomFilterAtom)

  const [copied, setCopied] = useState(false)
  const [currentAccordionItem, setAccordionItem] = useState<string|null>(null)

  const [activePage, setPage] = useRecoilState(locationActivePageAtom)

  useEffect(() => {
    setTimeout(() => {
      if (copied) setCopied(false)
    }, 2000)
  }, [copied, setCopied])

  return (
    <>
      <Paper p="md">
        <Stack>
          <Group position='apart'>
            <Text size={20}>Existing Locations</Text>
            <Checkbox
              label='Show Vanilla'
              color="orange"
              disabled={!checkedCustom}
              checked={checkedVanilla}
              onChange={(e) => setCheckedVanilla(e.currentTarget.checked)}
            />
            <Checkbox
              label='Show Custom'
              color="orange"
              disabled={!checkedVanilla}
              checked={checkedCustom}
              onChange={(e) => setCheckedCustom(e.currentTarget.checked)}
            />
          </Group>
          
          <LocationSearch />
          <Button
            uppercase
            variant="outline"
            color="orange"
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
          <ScrollArea style={{ height: 500 }} scrollbarSize={0}>
            <Stack>
              {pages[activePage] && pages[activePage].map((location: any, index: number) => (
                <Accordion value={currentAccordionItem} onChange={setAccordionItem}>
                  <Accordion.Item value={index.toString()}>
                    <Accordion.Control>
                      <Stack spacing={0}>
                       <Text size="xl">{location.name}</Text>
                       <Text size="xs">Coords: {location.x}, {location.y}, {location.z}</Text>
                     </Stack>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Group grow spacing="xs">
                        <Button
                          variant="outline"
                          color="orange"
                          size="xs"
                          onClick={() =>
                            teleportToLocation({ name: location.name, x: location.x, y: location.y, z: location.z, heading: location.heading })
                          }
                        >
                          Teleport
                        </Button>
                        <Button
                          variant="outline"
                          color="orange"
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
                          color={copied ? 'teal' : 'orange'}
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
              ))}
            </Stack>
          </ScrollArea>
          <Center>
            <Pagination page={activePage} onChange={setPage} total={pageCount} />
          </Center>
        </Stack>
      </Paper>
    </>
  )
}

export default Locations
