import {
  ArrowRightOutlined,
  BellOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined
} from '@ant-design/icons'
import { Button, Tag } from 'antd'
import type { JSX } from 'react'
import type { BootstrapPayload } from '../../../shared/contracts'
import type { CardFeedback } from '../../../shared/models'

type Props = {
  data: BootstrapPayload
  busy: boolean
  onNext: () => void
  onFeedback: (feedback: CardFeedback) => void
  onPause: () => void
  onTestNotification: () => void
}

const formatTime = (value: string): string =>
  new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short'
  }).format(new Date(value))

export function LearningView({
  data,
  busy,
  onNext,
  onFeedback,
  onPause,
  onTestNotification
}: Props): JSX.Element {
  const { currentCard: card, settings } = data
  const learnedCount = data.history.filter((item) => item.feedback === 'understood').length
  const paused = data.pausedUntil !== null && new Date(data.pausedUntil) > new Date()

  return (
    <div className="learning-layout">
      <section className="learning-primary">
        <div className="page-heading">
          <div>
            <p className="section-kicker">TODAY’S MICRO-LESSON</p>
            <h1>A useful idea, right when you need a break.</h1>
          </div>
          <div className="lesson-count">
            <span>{learnedCount}</span>
            ideas understood
          </div>
        </div>

        <article className="lesson-card">
          <div className="lesson-card__glow lesson-card__glow--one" />
          <div className="lesson-card__glow lesson-card__glow--two" />
          <div className="lesson-meta">
            <div>
              <Tag color="purple" bordered={false}>
                {card.category.toUpperCase()}
              </Tag>
              <span className="level-pill">ENGLISH {card.level}</span>
            </div>
            <span className="reading-time">
              <ClockCircleOutlined /> {card.estimatedSeconds} sec
            </span>
          </div>

          <h2>{card.title}</h2>
          <p className="notification-copy">{card.notificationText}</p>
          <p className="explanation-copy">{card.explanation}</p>

          <div className="example-box">
            <div className="example-label">EXAMPLE</div>
            <div className="example-text">“{card.example}”</div>
          </div>

          <div className="lesson-tags">
            {card.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>

          <div className="lesson-actions">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={busy}
              onClick={() => onFeedback('understood')}
            >
              Got it
            </Button>
            <Button
              icon={<RedoOutlined />}
              disabled={busy}
              onClick={() => onFeedback('repeat')}
            >
              Repeat later
            </Button>
            <Button
              type="text"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              disabled={busy}
              onClick={onNext}
            >
              Next idea
            </Button>
          </div>
        </article>
      </section>

      <aside className="rhythm-panel">
        <div className="rhythm-panel__header">
          <div className="rhythm-icon">
            <BellOutlined />
          </div>
          <div>
            <p>Your learning rhythm</p>
            <span>{paused ? 'Temporarily paused' : 'Quietly running in the tray'}</span>
          </div>
        </div>

        <div className="rhythm-stat">
          <span>Next reminder</span>
          <strong>{paused && data.pausedUntil ? formatTime(data.pausedUntil) : formatTime(data.nextNotificationAt)}</strong>
        </div>
        <div className="rhythm-stat">
          <span>Active hours</span>
          <strong>
            {settings.activeStart}–{settings.activeEnd}
          </strong>
        </div>
        <div className="rhythm-stat">
          <span>Frequency</span>
          <strong>Every {settings.notificationIntervalMinutes} min</strong>
        </div>
        <div className="rhythm-stat">
          <span>Daily limit</span>
          <strong>{settings.maxNotificationsPerDay} ideas</strong>
        </div>

        <div className="rhythm-actions">
          <Button block icon={<BellOutlined />} onClick={onTestNotification}>
            Send test notification
          </Button>
          <Button block type="text" icon={<PauseCircleOutlined />} onClick={onPause}>
            Pause for one hour
          </Button>
        </div>

        <p className="rhythm-hint">
          Closing the window keeps Sagelet active. Use the tray menu to exit completely.
        </p>
      </aside>
    </div>
  )
}
