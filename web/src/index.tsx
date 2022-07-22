import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import { VisibilityProvider } from "./providers/VisibilityProvider"
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

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
