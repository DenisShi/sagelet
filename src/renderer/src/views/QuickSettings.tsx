import { SettingOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Form, Popover, Select, Switch, Typography } from 'antd'
import { useEffect, useState, type JSX } from 'react'
import type { AppSettings, LearningLevel } from '../../../shared/models'

type Props = {
  settings: AppSettings
  busy: boolean
  onSave: (settings: AppSettings) => void
}

const levelOptions: Array<{ value: LearningLevel; label: string }> = [
  { value: 'A1', label: 'A1 · Beginner' },
  { value: 'A2', label: 'A2 · Elementary' },
  { value: 'B1', label: 'B1 · Intermediate' },
  { value: 'B2', label: 'B2 · Upper intermediate' }
]

const intervalOptions = [15, 30, 60, 120, 180].map((minutes) => ({
  value: minutes,
  label: minutes < 60 ? `${minutes} min` : `${minutes / 60} h`
}))

export function QuickSettings({ settings, busy, onSave }: Props): JSX.Element {
  const [draft, setDraft] = useState(settings)
  const [open, setOpen] = useState(false)

  useEffect(() => setDraft(settings), [settings])

  const save = (): void => {
    onSave(draft)
    setOpen(false)
  }

  const content = (
    <Form className="quick-settings" layout="vertical" size="small">
      <Flex className="quick-settings__switch-row" align="center" justify="space-between">
        <Typography.Text>Notifications</Typography.Text>
        <Switch
          size="small"
          checked={draft.notificationsEnabled}
          onChange={(notificationsEnabled) => setDraft({ ...draft, notificationsEnabled })}
        />
      </Flex>
      <Divider />
      <Form.Item label="English level">
        <Select
          value={draft.level}
          options={levelOptions}
          onChange={(level) => setDraft({ ...draft, level })}
        />
      </Form.Item>
      <Form.Item label="Reminder interval">
        <Select
          value={draft.notificationIntervalMinutes}
          options={intervalOptions}
          onChange={(notificationIntervalMinutes) =>
            setDraft({ ...draft, notificationIntervalMinutes })
          }
        />
      </Form.Item>
      <Flex className="quick-settings__switch-row" align="center" justify="space-between">
        <Typography.Text>Start with Windows</Typography.Text>
        <Switch
          size="small"
          checked={draft.startAtLogin}
          onChange={(startAtLogin) => setDraft({ ...draft, startAtLogin })}
        />
      </Flex>
      <Button type="primary" size="small" block loading={busy} onClick={save}>
        Save
      </Button>
    </Form>
  )

  return (
    <Popover
      content={content}
      title="Settings"
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        type="text"
        size="small"
        icon={<SettingOutlined />}
        aria-label="Open settings"
      />
    </Popover>
  )
}
