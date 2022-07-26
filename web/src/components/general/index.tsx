import { Accordion } from "@mantine/core"
import { useState } from "react"
import Character from "./Character"
import Teleport from "./Teleport"
import Vehicle from "./Vehicle"

const General = () => {

  return (
    <>
      <Accordion iconSize={14} multiple>
        <Accordion.Item label="Teleport">
          <Teleport />
        </Accordion.Item>

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