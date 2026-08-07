import {
  ArrowRightOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  RedoOutlined
} from '@ant-design/icons'
import { Alert, Button, Card, Divider, Flex, Space, Tag, Typography } from 'antd'
import type { JSX } from 'react'
import type { BootstrapPayload } from '../../../shared/contracts'
import type { AppSettings, CardFeedback } from '../../../shared/models'
import { QuickSettings } from './QuickSettings'

const { Paragraph, Text, Title } = Typography

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
    <Card
      className="lesson-card"
      size="small"
      variant="outlined"
      title={
        <Space size={8} wrap>
          <Tag color="blue">{card.category.toUpperCase()}</Tag>
          <Text type="secondary">English {card.level}</Text>
          <Text type="secondary" className="reading-time">
            <ClockCircleOutlined /> {card.estimatedSeconds} sec
          </Text>
        </Space>
      }
      extra={
        <Space.Compact className="window-actions">
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
        </Space.Compact>
      }
    >
      <Flex className="language-grid" align="stretch">
        <section className="language-panel">
          <Text className="language-label" type="secondary">
            ENGLISH
          </Text>
          <Title level={4}>{card.title}</Title>
          <Paragraph className="lesson-summary" strong>
            {card.notificationText}
          </Paragraph>
          <Paragraph className="lesson-explanation" type="secondary">
            {card.explanation}
          </Paragraph>
        </section>

        <Divider type="vertical" className="language-divider" />

        <section className="language-panel" lang="ru">
          <Text className="language-label" type="secondary">
            РУССКИЙ
          </Text>
          <Title level={4}>{card.russian.title}</Title>
          <Paragraph className="lesson-summary" strong>
            {card.russian.notificationText}
          </Paragraph>
          <Paragraph className="lesson-explanation" type="secondary">
            {card.russian.explanation}
          </Paragraph>
        </section>
      </Flex>

      <Alert
        className="example-alert"
        type="info"
        variant="outlined"
        showIcon={false}
        title={<Text strong>“{card.example}”</Text>}
        description={
          <Text type="secondary" lang="ru">
            {card.russian.example}
          </Text>
        }
      />

      <footer>
        <Divider className="action-divider" />
        <Flex className="lesson-actions" justify="center" gap={8}>
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
        </Flex>
      </footer>
    </Card>
  )
}
