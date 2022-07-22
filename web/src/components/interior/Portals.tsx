import { useEffect, useState } from "react"
import { Checkbox, CheckboxGroup } from "@mantine/core"
import { PortalProps } from "."

const Portals = (props: PortalProps) => {
  const { portals } = props

  // Portal checkboxes
  const [value, setValue] = useState<string[]>([])
  useEffect(() => {
      fetch(`https://dolu-mapping-tool/dmt:toggleInteriorsDraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          value
        })
      }).then(resp => resp.json())
  })

  return (
    <>
      <CheckboxGroup
        orientation='horizontal'
        spacing="xs"
        size="sm"
        color="orange"
        value={value}
        onChange={setValue}
      >
        <Checkbox value="portalInfos" label="Infos" />
        <Checkbox value="portalPoly" label="Fill" />
        <Checkbox value="portalLines" label="Outline" />
        <Checkbox value="portalCorners" label="Corners" />
      </CheckboxGroup>
    </>
  )
}

export default Portals