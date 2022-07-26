import React, { useEffect, useState } from 'react'
import './App.css'
import { Box, Group, ScrollArea, Tabs } from '@mantine/core'
import Header from './Header'
import Interior from './interior'
import World from './world'
import { debugData, debugVisible } from "../utils/debugData"
import General from './general'
import { useNuiEvent } from '../hooks/useNuiEvent'

debugData(debugVisible)

const App: React.FC = () => {

  // Tab key to switch
  const [activeTab, setActiveTab] = useState(0)
  const onChange = (active: number, tabKey: string) => { setActiveTab(active) }

  useEffect(() => {
    // Ask interior data if interior tab is selected
    if (activeTab === 1) {
      console.log('Interior tab selected!')

      fetch(`https://DoluMappingTool/dmt:interior:getData`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=UTF-8'}
        // No body needed
      }).then(resp => resp.json())
    }
  })

  const [isPlayerInInt, setIsPlayerInInt] = useState<boolean>(false)
  useNuiEvent('setIsPlayerInInt', setIsPlayerInInt)

  return (
    <>
      <Group position="apart" align='top'>
        <Box sx={(theme) => ({
            userSelect: "none",
            margin: theme.spacing.lg,
            width: theme.breakpoints.sm/1.5,
            backgroundColor: 'rgba(30, 35, 45, .95)',
            color: theme.colors.dark[0],
            padding: theme.spacing.md,
            borderRadius: theme.radius.lg
          })}
        >
          <Header />
          <Tabs
            color="orange"
            active={activeTab}
            onTabChange={onChange}
            grow
            // activateTabWithKeyboard={!isPlayerInInt} ------------ NEED MANTINE V5 !
          >
            {/* TAB 1 - GENERAL */}
            <Tabs.Tab label="General" tabKey="First">
              <ScrollArea sx={(theme) => ({ height: '50vh' })} scrollbarSize={8}>
                <General />
              </ScrollArea>
            </Tabs.Tab>

            {/* TAB 2 - INTERIORS */}
            <Tabs.Tab label="Interiors" tabKey="Second" disabled={!isPlayerInInt}>
              <ScrollArea sx={(theme) => ({ height: '50vh' })} scrollbarSize={8}>
                <Interior />
              </ScrollArea>
            </Tabs.Tab>

            {/* TAB 3 - WORLD */}
            <Tabs.Tab label="World" tabKey="Third">
              <ScrollArea sx={(theme) => ({ height: '50vh' })} scrollbarSize={8}>
                <World />
            </ScrollArea>
            </Tabs.Tab>
          </Tabs>
        </Box>
      </Group>
    </>
  )
}

export default App
