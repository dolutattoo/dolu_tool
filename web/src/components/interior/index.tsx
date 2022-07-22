import { useState } from "react"
import { useNuiEvent } from "../../hooks/useNuiEvent"
import { Accordion, Group, Select, Text } from "@mantine/core"
import Portals from "./Portals"
import Rooms from "./Rooms"

export interface InteriorProps {
  interiorId: any
  roomCount?: number
  portalCount?: number
  rooms?: RoomProps,
  portals?: Array<PortalProps>
  currentRoom?: any
}

export interface RoomProps {
  rooms?: any
}

export interface PortalProps {
  portals?: any
}

const InteriorInfos = (props: any) => {
  const { interiorData } = props

  return (
    <>
      <Group><Text>Interior ID:</Text><Text color="orange" > { interiorData?.interiorId }</Text></Group>
      <Group><Text>Room count:</Text><Text color="orange" > { interiorData?.roomCount }</Text></Group>
      <Group><Text>Portal count:</Text><Text color="orange" > { interiorData?.portalCount }</Text></Group>
      <Group><Text>Current room:</Text><Text color="orange" > { interiorData?.currentRoom?.currentRoomName }</Text></Group>
    </>
  )
}

const Interior = () => {
  const [intData, setIntData] = useState<InteriorProps|null>(null)
  useNuiEvent('setIntData', setIntData)

  return (
    <>
      <Accordion initialItem={0} iconSize={14} multiple>
        <Accordion.Item label="General">
          {intData?.interiorId && <InteriorInfos interiorData={ intData } />}
        </Accordion.Item>

        <Accordion.Item label="Portals">
          <Portals portals={ intData?.portals }/>
        </Accordion.Item>

        <Accordion.Item label="Rooms">
          <Rooms rooms={ intData?.rooms } />
        </Accordion.Item>

        <Accordion.Item label="Timecycle">
          <Select
            data={['v_recycle', 'v_jewel2', 'v_foundry', 'V_Metro_station']}
            placeholder={'none'}
            searchable
            nothingFound="No timecycle found"
            />
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default Interior