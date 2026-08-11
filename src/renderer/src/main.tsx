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
          colorPrimary: '#a6380c',
          colorInfo: '#a6380c',
          colorSuccess: '#49785f',
          colorText: '#232b38',
          colorTextSecondary: '#666b73',
          colorBgBase: '#fdfaf5',
          colorBgElevated: '#fffdf9',
          colorBorder: '#e5d6c4',
          colorSplit: '#eadfd3',
          borderRadius: 8,
          controlHeight: 32,
          fontSize: 13,
          fontFamily:
            '"Segoe UI", ui-sans-serif, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        components: {
          Button: { borderRadius: 7, fontWeight: 500 },
          Card: { bodyPaddingSM: 16, headerHeightSM: 58 },
          Select: { controlHeightSM: 28 },
          Switch: { colorPrimary: '#a6380c', colorPrimaryHover: '#7e2809' }
        }
      }}
    >
      <AntApp>
        <RootApp />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
)
