import {
  ArrowRightOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  RedoOutlined
} from '@ant-design/icons'
import { Button, Tag } from 'antd'
import type { JSX } from 'react'
import type { BootstrapPayload } from '../../../shared/contracts'
import type { AppSettings, CardFeedback } from '../../../shared/models'
import { QuickSettings } from './QuickSettings'

type Props = {
  data: BootstrapPayload
  busy: boolean
  onNext: () => void
  onFeedback: (feedback: CardFeedback) => void
  onSaveSettings: (settings: AppSettings) => void
  onHide: () => void
}

export function LearningView({
  data,
  busy,
  onNext,
  onFeedback,
  onSaveSettings,
  onHide
}: Props): JSX.Element {
  const { currentCard: card } = data

  return (
    <article className="lesson-card">
      <div className="window-handle" />
      <div className="lesson-card__glow" />

      <header className="lesson-meta">
        <div className="lesson-meta__labels">
          <Tag color="purple" bordered={false}>
            {card.category.toUpperCase()}
          </Tag>
          <span className="level-pill">ENGLISH {card.level}</span>
          <span className="reading-time">
            <ClockCircleOutlined /> {card.estimatedSeconds} sec
          </span>
        </div>
        <div className="window-actions">
          <QuickSettings
            settings={data.settings}
            busy={busy}
            onSave={onSaveSettings}
          />
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            aria-label="Hide Sagelet"
            onClick={onHide}
          />
        </div>
      </header>

      <section className="language-section language-section--english">
        <h1>{card.title}</h1>
        <p className="notification-copy">{card.notificationText}</p>
        <p className="explanation-copy">{card.explanation}</p>
      </section>

      <section className="language-section language-section--russian" lang="ru">
        <span className="translation-label">ПО-РУССКИ</span>
        <h2>{card.russian.title}</h2>
        <p className="translation-summary">{card.russian.notificationText}</p>
        <p className="translation-copy">{card.russian.explanation}</p>
      </section>

      <div className="example-box">
        <span className="example-label">EXAMPLE</span>
        <strong>“{card.example}”</strong>
        <span className="example-translation" lang="ru">{card.russian.example}</span>
      </div>

      <footer className="lesson-actions">
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
      </footer>
    </article>
  )
}
