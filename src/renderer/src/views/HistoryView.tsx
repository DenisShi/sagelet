import { CheckCircleFilled, ClockCircleOutlined, HistoryOutlined, RedoOutlined } from '@ant-design/icons'
import { Empty } from 'antd'
import type { JSX } from 'react'
import type { HistoryItem } from '../../../shared/models'

type Props = { history: HistoryItem[] }

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))

export function HistoryView({ history }: Props): JSX.Element {
  return (
    <section className="simple-view">
      <div className="page-heading">
        <div>
          <p className="section-kicker">YOUR PROGRESS</p>
          <h1>Recently explored ideas</h1>
          <p className="page-subtitle">Your history is stored only on this computer.</p>
        </div>
        <div className="page-icon"><HistoryOutlined /></div>
      </div>

      <div className="history-card">
        {history.length === 0 ? (
          <Empty description="Your first learning card will appear here." />
        ) : (
          history.map((item) => (
            <div className="history-row" key={item.id}>
              <div className={`history-status history-status--${item.feedback ?? 'open'}`}>
                {item.feedback === 'understood' ? (
                  <CheckCircleFilled />
                ) : item.feedback === 'repeat' ? (
                  <RedoOutlined />
                ) : (
                  <ClockCircleOutlined />
                )}
              </div>
              <div className="history-copy">
                <strong>{item.title}</strong>
                <span>{item.category} · English {item.level}</span>
              </div>
              <div className="history-result">
                <span>{item.feedback === 'understood' ? 'Understood' : item.feedback === 'repeat' ? 'Repeat later' : 'Viewed'}</span>
                <time>{formatDate(item.shownAt)}</time>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
