import React from 'react'
import ReactDOM from 'react-dom/client'
import { App as AntApp, ConfigProvider } from 'antd'
import RootApp from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#b45137',
          colorInfo: '#b45137',
          colorSuccess: '#687653',
          colorText: '#303128',
          colorTextSecondary: '#736e62',
          colorBgElevated: '#faf5eb',
          colorBorder: '#cfc2aa',
          borderRadius: 7,
          fontFamily:
            'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        },
        components: {
          Button: { controlHeight: 42, borderRadius: 7, fontWeight: 650 },
          Select: { controlHeight: 42 },
          Switch: { colorPrimary: '#687653', colorPrimaryHover: '#566242' }
        }
      }}
    >
      <AntApp>
        <RootApp />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
)
