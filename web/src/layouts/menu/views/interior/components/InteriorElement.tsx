import { Text, Paper, Group, Checkbox, Space } from "@mantine/core"
import { useEffect, useState } from "react"
import { getInteriorData } from "../../../../../atoms/interior"
import { fetchNui } from "../../../../../utils/fetchNui"

const InteriorElement: React.FC = () => {
  const interior = getInteriorData()
  
  const [checkboxesValue, setCheckboxesValue] = useState<string[]>([])
  useEffect(() => {
    if (checkboxesValue) fetchNui('dmt:setPortalCheckbox', checkboxesValue)
  }, [checkboxesValue, setCheckboxesValue])
  
  return (
    <>
      {/* Current interior infos */}
      <Paper p="md">
        <Text size={24} weight={600}>Current interior infos</Text>
        <Space h="xs" />
        <Group><Text>Interior ID:</Text><Text color="blue.4" > { interior.interiorId }</Text></Group>
        <Group><Text>Room count:</Text><Text color="blue.4" > { interior.roomCount }</Text></Group>
        <Group><Text>Portal count:</Text><Text color="blue.4" > { interior.portalCount }</Text></Group>
        <Group><Text>Current room:</Text><Text color="blue.4" > { interior.currentRoom?.index } - { interior.currentRoom?.name }</Text></Group>
      </Paper>

      {/* Portal drawing */}
      <Paper p="md">
        <Text size={24} weight={600}>Portal drawing</Text>
        
        {/* <Space h="xs" /> */}
        
        <Checkbox.Group
          orientation='horizontal'
          spacing="xs"
          size="md"
          value={checkboxesValue}
          onChange={setCheckboxesValue}
        >
          <Checkbox color="blue.4" value="portalInfos" label="Infos" />
          <Checkbox color="blue.4" value="portalPoly" label="Fill portals" />
          <Checkbox color="blue.4" value="portalLines" label="Outline" />
          <Checkbox color="blue.4" value="portalCorners" label="Corners" />
        </Checkbox.Group>
      </Paper>
    </>
    )
  }
  
  export default InteriorElement