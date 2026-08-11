import { useCallback, useEffect, useState, type JSX } from 'react'
import { App as AntApp, ConfigProvider, Spin, theme } from 'antd'
import type { BootstrapPayload } from '../../shared/contracts'
import type { AppSettings } from '../../shared/models'
import { LearningView } from './views/LearningView'

export default function RootApp(): JSX.Element {
  const { message } = AntApp.useApp()
  const [data, setData] = useState<BootstrapPayload | null>(null)
  const [busy, setBusy] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setData(await window.sagelet.getBootstrap())
    } catch {
      void message.error('Sagelet could not load the current lesson.')
    }
  }, [message])

  useEffect(() => {
    void loadData()
    return window.sagelet.onCardChanged(() => void loadData())
  }, [loadData])

  const runAction = async (
    action: () => Promise<BootstrapPayload>,
    successMessage?: string
  ): Promise<boolean> => {
    setBusy(true)
    try {
      setData(await action())
      if (successMessage) void message.success(successMessage)
      return true
    } catch {
      void message.error('The action could not be completed.')
      return false
    } finally {
      setBusy(false)
    }
  }

  const submitUnderstood = async (): Promise<void> => {
    const submitted = await runAction(() => window.sagelet.submitFeedback('understood'))
    if (submitted) await window.sagelet.hideWindow()
  }

  const saveSettings = async (settings: AppSettings): Promise<void> => {
    await runAction(() => window.sagelet.updateSettings(settings), 'Settings saved.')
  }

  if (!data) {
    return (
      <div className="loading-screen">
        <Spin />
      </div>
    )
  }

  const darkMode = data.settings.themeMode === 'dark'
  const colorTokens = darkMode
    ? {
        colorBgContainer: '#181a1f',
        colorBgElevated: '#202329',
        colorBorder: '#3a404a',
        colorBorderSecondary: '#303640',
        colorIcon: '#c4cad3',
        colorText: '#f3f4f6',
        colorTextSecondary: '#aeb6c2'
      }
    : undefined

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: colorTokens
      }}
    >
      <main className={`panel-shell panel-shell--${data.settings.themeMode}`}>
        <LearningView
          data={data}
          busy={busy}
          onNext={() => runAction(() => window.sagelet.showNextCard())}
          onSelectQuestion={(position) =>
            runAction(() => window.sagelet.showLessonCard(position))
          }
          onGotIt={submitUnderstood}
          onSaveSettings={saveSettings}
          onHide={() => void window.sagelet.hideWindow()}
        />
      </main>
    </ConfigProvider>
  )
}
