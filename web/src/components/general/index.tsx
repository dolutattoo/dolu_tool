import { Accordion } from "@mantine/core"
import { useState } from "react"
import Character from "./Character"
import Vehicle from "./Vehicle"

const General = () => {

  return (
    <>
      <Accordion initialItem={0} iconSize={14} multiple>
        <Accordion.Item label="Character">
          <Character />
        </Accordion.Item>

        <Accordion.Item label="Vehicle">
          <Vehicle />
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default General