import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import { VisibilityProvider } from "./providers/VisibilityProvider"
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { isEnvBrowser } from './utils/misc'
import { fetchNui } from './utils/fetchNui'


interface NuiMessageData<T = unknown> {
  action: string
  data: T
}

let state = false

const unloadReact = () => {
  state = false
  ReactDOM.unmountComponentAtNode(document.getElementById('root') as Element)
  window.removeEventListener("keydown", keyHandler)
}

const keyHandler = (e: KeyboardEvent) => {
  if (["Escape"].includes(e.code)) {
    if (!isEnvBrowser()) fetchNui("hideFrame")
    unloadReact()
  }
}

const eventListener = (event: MessageEvent<NuiMessageData<boolean>>) => {
  const { action: eventAction, data } = event.data

  if (eventAction == null || eventAction !== 'setVisible') { return }

  if (data === true && state === false) {
    window.addEventListener("keydown", keyHandler)

    ReactDOM.render(
      <React.StrictMode>
        <MantineProvider theme={{ colorScheme: 'dark', focusRing: 'never' }}>
          <NotificationsProvider position="top-right">
            <App />
          </NotificationsProvider>
        </MantineProvider>
      </React.StrictMode>,
      document.getElementById('root'),
      () => { state = true }
    )
  } else if (state === true) {
    unloadReact()
  }
}

window.addEventListener("message", eventListener)

ReactDOM.render(
  <React.StrictMode>
      <VisibilityProvider>
        <MantineProvider theme={{ colorScheme: 'dark', focusRing: 'never' }}>
          <NotificationsProvider position="top-right">
            <App />
          </NotificationsProvider>
        </MantineProvider>
      </VisibilityProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
