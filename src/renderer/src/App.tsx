import { useCallback, useEffect, useState, type JSX } from 'react'
import { App as AntApp, ConfigProvider, Spin, theme } from 'antd'
import type { BootstrapPayload } from '../../shared/contracts'
import type { AppSettings, CardFeedback } from '../../shared/models'
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
  ): Promise<void> => {
    setBusy(true)
    try {
      setData(await action())
      if (successMessage) void message.success(successMessage)
    } catch {
      void message.error('The action could not be completed.')
    } finally {
      setBusy(false)
    }
  }

  const submitFeedback = (feedback: CardFeedback): Promise<void> =>
    runAction(
      () => window.sagelet.submitFeedback(feedback),
      feedback === 'understood' ? undefined : 'This idea will return later.'
    )

  const saveSettings = (settings: AppSettings): Promise<void> =>
    runAction(() => window.sagelet.updateSettings(settings), 'Settings saved.')

  if (!data) {
    return (
      <div className="loading-screen">
        <Spin />
      </div>
    )
  }

  const darkMode = data.settings.themeMode === 'dark'

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <main className={`panel-shell panel-shell--${data.settings.themeMode}`}>
        <LearningView
          data={data}
          busy={busy}
          onNext={() => runAction(() => window.sagelet.showNextCard())}
          onFeedback={submitFeedback}
          onSaveSettings={saveSettings}
          onHide={() => void window.sagelet.hideWindow()}
        />
      </main>
    </ConfigProvider>
  )
}
