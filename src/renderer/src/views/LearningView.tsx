import {
  ArrowRightOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { Button, Card, Divider, Flex, Space, Tag, Typography } from 'antd'
import type { JSX } from 'react'
import type { BootstrapPayload } from '../../../shared/contracts'
import type { AppSettings, LearningCard } from '../../../shared/models'
import { QuickSettings } from './QuickSettings'

const { Paragraph, Text, Title } = Typography

type Props = {
  data: BootstrapPayload
  busy: boolean
  onNext: () => void
  onSelectQuestion: (position: number) => void
  onGotIt: () => void
  onSaveSettings: (settings: AppSettings) => void
  onHide: () => void
}

type LessonPoint = {
  title: string
  english: string
  russian: string
}

const splitComparisonTitle = (title: string): string[] =>
  title.split(/\s+(?:vs|or|and)\s+|\s*\/\s*/i).map((part) => part.trim())

const splitClauses = (text: string): string[] =>
  text.split(/;\s*|,\s*(?=[“"'])/).map((part) => part.trim())

const removeTermPrefix = (text: string, term: string): string => {
  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text
    .replace(new RegExp(`^[“\"']?${escapedTerm}[”\"']?\\s*`, 'i'), '')
    .replace(/^(?:means|означает)\s+/i, '')
    .replace(/^—\s*/, '')
    .replace(/^./, (character) => character.toLocaleLowerCase())
}

const getLessonPoints = (card: LearningCard): LessonPoint[] => {
  const terms = splitComparisonTitle(card.title)
  const englishClauses = splitClauses(card.notificationText)
  const russianClauses = splitClauses(card.russian.notificationText)

  if (terms.length === 2 && englishClauses.length === 2 && russianClauses.length === 2) {
    return terms.map((term, index) => ({
      title: term,
      english: removeTermPrefix(englishClauses[index], term),
      russian: removeTermPrefix(russianClauses[index], term)
    }))
  }

  return [
    {
      title: card.title,
      english: card.notificationText,
      russian: card.russian.notificationText
    }
  ]
}

export function LearningView({
  data,
  busy,
  onNext,
  onSelectQuestion,
  onGotIt,
  onSaveSettings,
  onHide
}: Props): JSX.Element {
  const { currentCard: card } = data
  const lessonPoints = getLessonPoints(card)
  const lessonSteps = Array.from(
    { length: data.lessonProgress.total },
    (_, index) => index + 1
  )

  return (
    <Card
      className="lesson-card"
      size="small"
      variant="outlined"
      title={
        <Flex className="lesson-header" align="center" gap={26}>
          <Flex className="brand" align="center" gap={9}>
            <span className="brand__mark" aria-hidden="true">✦</span>
            <Text className="brand__name">Sagelet</Text>
          </Flex>
          <Divider type="vertical" className="brand-divider" />
          <Tag className="category-tag">{card.category.toUpperCase()}</Tag>
          <Text type="secondary" className="level-label">English {card.level}</Text>
          <Flex className="lesson-progress" align="center" gap={10}>
            <Text className="lesson-progress__label">
              Question {data.lessonProgress.current} of {data.lessonProgress.total}
            </Text>
            <div
              className="lesson-progress__steps"
              role="group"
              aria-label="Question navigation"
            >
              {lessonSteps.map((step) => (
                <button
                  type="button"
                  className={
                    step === data.lessonProgress.current
                      ? 'lesson-progress__step lesson-progress__step--active'
                      : 'lesson-progress__step'
                  }
                  key={step}
                  aria-label={`Open question ${step}`}
                  aria-pressed={step === data.lessonProgress.current}
                  disabled={busy}
                  title={`Question ${step}`}
                  onClick={() => onSelectQuestion(step)}
                />
              ))}
            </div>
          </Flex>
        </Flex>
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
            icon={<CloseOutlined />}
            aria-label="Hide Sagelet"
            onClick={onHide}
          />
        </Space.Compact>
      }
    >
      <Title level={2} className="lesson-title">{card.title}</Title>
      <div className="title-ornament" aria-hidden="true"><span>✦</span></div>

      <div className="lesson-content">
        <section className="lesson-points" aria-label="Lesson explanation">
          {lessonPoints.map((point) => (
            <div className="lesson-point" key={point.title}>
              <div className="lesson-point__english">
                <div className="lesson-point__heading">
                  <Text strong className="lesson-point__term">{point.title}</Text>
                  <Text className="lesson-point__equals">=</Text>
                </div>
                <Text className="lesson-point__description">{point.english}</Text>
              </div>
              <Divider type="vertical" />
              <Text className="lesson-point__russian" lang="ru">{point.russian}</Text>
            </div>
          ))}
        </section>

        <section className="example-card" aria-label="Example">
          <div className="example-card__quote" aria-hidden="true">“</div>
          <div className="example-row">
            <Text className="example-language">EN</Text>
            <Paragraph>{card.example}</Paragraph>
          </div>
          <Divider dashed />
          <div className="example-row">
            <Text className="example-language">RU</Text>
            <Paragraph lang="ru">{card.russian.example}</Paragraph>
          </div>
        </section>
      </div>

      <footer className="lesson-footer">
        <Flex className="lesson-actions" justify="flex-end" gap={14}>
          <Button
            className="got-it-button"
            icon={<CheckOutlined />}
            loading={busy}
            onClick={onGotIt}
          >
            Got it
          </Button>
          <Button
            type="primary"
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
