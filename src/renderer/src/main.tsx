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
          colorPrimary: '#34618a',
          colorInfo: '#34618a',
          colorSuccess: '#49785f',
          colorText: '#202830',
          colorTextSecondary: '#69737d',
          colorBgBase: '#f3f5f7',
          colorBgElevated: '#ffffff',
          colorBorder: '#d7dde3',
          colorSplit: '#e5e9ed',
          borderRadius: 7,
          controlHeight: 30,
          fontSize: 13,
          fontFamily:
            '"Segoe UI", ui-sans-serif, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        components: {
          Button: { borderRadius: 6, fontWeight: 500 },
          Card: { bodyPaddingSM: 16, headerHeightSM: 42 },
          Select: { controlHeightSM: 28 },
          Switch: { colorPrimary: '#34618a', colorPrimaryHover: '#284f73' }
        }
      }}
    >
      <AntApp>
        <RootApp />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
)
