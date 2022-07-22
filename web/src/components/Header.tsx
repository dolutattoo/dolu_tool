import { Divider, Title } from "@mantine/core"
import React from "react"

const Header: React.FC = () => {

  return (
    <>
      <Title style={{ fontFamily: "sans-serif", textAlign: 'center' }}>Dolu Mapping Tool</Title>
      <Divider my="md" />
    </>
  )
}

export default Header