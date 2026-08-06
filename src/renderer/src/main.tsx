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
          colorPrimary: '#6d55f7',
          colorInfo: '#6d55f7',
          colorSuccess: '#21a47d',
          colorText: '#27253d',
          colorTextSecondary: '#77748e',
          borderRadius: 12,
          fontFamily:
            'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        },
        components: {
          Button: { controlHeight: 42, borderRadius: 12, fontWeight: 600 },
          Select: { controlHeight: 42 },
          Switch: { colorPrimary: '#6d55f7', colorPrimaryHover: '#5d44ed' }
        }
      }}
    >
      <AntApp>
        <RootApp />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
)
