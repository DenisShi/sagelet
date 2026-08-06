import { useCallback, useEffect, useState, type JSX, type ReactNode } from 'react'
import {
  BellOutlined,
  BookOutlined,
  HistoryOutlined,
  HomeOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { App as AntApp, Button, Spin } from 'antd'
import type { BootstrapPayload } from '../../shared/contracts'
import type { CardFeedback } from '../../shared/models'
import { LearningView } from './views/LearningView'
import { HistoryView } from './views/HistoryView'
import { SettingsView } from './views/SettingsView'

type ViewKey = 'learn' | 'history' | 'settings'

const navItems: Array<{ key: ViewKey; label: string; icon: ReactNode }> = [
  { key: 'learn', label: 'Learn', icon: <HomeOutlined /> },
  { key: 'history', label: 'History', icon: <HistoryOutlined /> },
  { key: 'settings', label: 'Settings', icon: <SettingOutlined /> }
]

export default function RootApp(): JSX.Element {
  const { message } = AntApp.useApp()
  const [view, setView] = useState<ViewKey>('learn')
  const [data, setData] = useState<BootstrapPayload | null>(null)
  const [busy, setBusy] = useState(false)

  const loadData = useCallback(async () => {
    const bootstrap = await window.sagelet.getBootstrap()
    setData(bootstrap)
  }, [])

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
    } finally {
      setBusy(false)
    }
  }

  const submitFeedback = (feedback: CardFeedback): Promise<void> =>
    runAction(
      () => window.sagelet.submitFeedback(feedback),
      feedback === 'understood' ? 'Nice — moving to the next idea.' : 'We’ll bring this card back soon.'
    )

  const testNotification = async (): Promise<void> => {
    const result = await window.sagelet.showTestNotification()
    if (result.shown) void message.success('Test notification sent.')
    else void message.warning('System notifications are unavailable in this environment.')
  }

  if (!data) {
    return (
      <div className="loading-screen">
        <div className="brand-mark">K</div>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="titlebar-drag" />

      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark brand-mark--small">K</div>
          <div>
            <div className="brand-name">Sagelet</div>
            <div className="brand-caption">Learn in small moments</div>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              className={`nav-item ${view === item.key ? 'nav-item--active' : ''}`}
              key={item.key}
              type="button"
              onClick={() => setView(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="topic-orb">
            <BookOutlined />
          </div>
          <div>
            <div className="topic-label">Current path</div>
            <div className="topic-value">English · {data.settings.level}</div>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div className="topbar-copy">
            <span className="eyebrow">CALM LEARNING MODE</span>
            <span className="live-status">
              <span className="live-dot" />
              {data.settings.notificationsEnabled ? 'Running' : 'Paused'}
            </span>
          </div>
          <Button
            type="text"
            icon={<BellOutlined />}
            className="hide-button"
            onClick={() => void window.sagelet.hideWindow()}
          >
            Hide to tray
          </Button>
        </header>

        <div className="view-container">
          {view === 'learn' && (
            <LearningView
              data={data}
              busy={busy}
              onNext={() => runAction(() => window.sagelet.showNextCard())}
              onFeedback={submitFeedback}
              onPause={() =>
                runAction(() => window.sagelet.pauseForMinutes(60), 'Notifications paused for one hour.')
              }
              onTestNotification={testNotification}
            />
          )}
          {view === 'history' && <HistoryView history={data.history} />}
          {view === 'settings' && (
            <SettingsView
              settings={data.settings}
              busy={busy}
              onSave={(settings) =>
                runAction(() => window.sagelet.updateSettings(settings), 'Settings saved.')
              }
            />
          )}
        </div>
      </main>
    </div>
  )
}
