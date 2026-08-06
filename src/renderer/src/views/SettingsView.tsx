import { useEffect, useState, type JSX } from 'react'
import { BellOutlined, ClockCircleOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons'
import { Button, InputNumber, Select, Switch } from 'antd'
import type { AppSettings } from '../../../shared/models'

type Props = {
  settings: AppSettings
  busy: boolean
  onSave: (settings: AppSettings) => void
}

const weekdays = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' }
]

const timeOptions = Array.from({ length: 16 }, (_, index) => {
  const hour = index + 6
  const value = `${String(hour).padStart(2, '0')}:00`
  return { value, label: value }
})

export function SettingsView({ settings, busy, onSave }: Props): JSX.Element {
  const [draft, setDraft] = useState(settings)

  useEffect(() => setDraft(settings), [settings])

  const toggleDay = (day: number): void => {
    setDraft((current) => {
      const hasDay = current.activeDays.includes(day)
      if (hasDay && current.activeDays.length === 1) return current
      return {
        ...current,
        activeDays: hasDay
          ? current.activeDays.filter((value) => value !== day)
          : [...current.activeDays, day]
      }
    })
  }

  const hasInvalidHours = draft.activeStart >= draft.activeEnd

  return (
    <section className="simple-view">
      <div className="page-heading">
        <div>
          <p className="section-kicker">PERSONALIZE SAGELET</p>
          <h1>Learning settings</h1>
          <p className="page-subtitle">Everything is saved locally and can be changed at any time.</p>
        </div>
        <div className="page-icon"><SettingOutlined /></div>
      </div>

      <div className="settings-grid">
        <div className="settings-card settings-card--wide">
          <div className="settings-card__heading">
            <div className="settings-card__icon"><BellOutlined /></div>
            <div>
              <strong>Notifications</strong>
              <span>Control how often learning cards appear.</span>
            </div>
            <Switch
              checked={draft.notificationsEnabled}
              onChange={(checked) => setDraft({ ...draft, notificationsEnabled: checked })}
            />
          </div>

          <div className="field-grid">
            <label className="field-label">
              <span>English level</span>
              <Select
                value={draft.level}
                options={['A1', 'A2', 'B1', 'B2'].map((level) => ({ value: level, label: level }))}
                onChange={(level) => setDraft({ ...draft, level })}
              />
            </label>
            <label className="field-label">
              <span>Reminder interval</span>
              <Select
                value={draft.notificationIntervalMinutes}
                options={[5, 15, 30, 60, 120, 180].map((minutes) => ({
                  value: minutes,
                  label: minutes < 60 ? `${minutes} minutes` : `${minutes / 60} ${minutes === 60 ? 'hour' : 'hours'}`
                }))}
                onChange={(notificationIntervalMinutes) =>
                  setDraft({ ...draft, notificationIntervalMinutes })
                }
              />
            </label>
            <label className="field-label">
              <span>Daily maximum</span>
              <InputNumber
                min={1}
                max={24}
                value={draft.maxNotificationsPerDay}
                onChange={(value) =>
                  setDraft({ ...draft, maxNotificationsPerDay: value ?? 1 })
                }
              />
            </label>
          </div>
        </div>

        <div className="settings-card settings-card--wide">
          <div className="settings-card__heading">
            <div className="settings-card__icon settings-card__icon--green"><ClockCircleOutlined /></div>
            <div>
              <strong>Active time</strong>
              <span>Sagelet stays quiet outside this schedule.</span>
            </div>
          </div>

          <div className="field-grid field-grid--time">
            <label className="field-label">
              <span>From</span>
              <Select
                value={draft.activeStart}
                options={timeOptions}
                onChange={(activeStart) => setDraft({ ...draft, activeStart })}
              />
            </label>
            <label className="field-label">
              <span>Until</span>
              <Select
                value={draft.activeEnd}
                options={timeOptions}
                status={hasInvalidHours ? 'error' : undefined}
                onChange={(activeEnd) => setDraft({ ...draft, activeEnd })}
              />
            </label>
          </div>
          {hasInvalidHours && <p className="field-error">End time must be later than start time.</p>}

          <div className="weekday-row">
            {weekdays.map((day) => (
              <button
                type="button"
                key={day.value}
                className={draft.activeDays.includes(day.value) ? 'weekday weekday--active' : 'weekday'}
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-card settings-card--wide compact-setting">
          <div>
            <strong>Start with Windows</strong>
            <span>Launch quietly when you sign in to your computer.</span>
          </div>
          <Switch
            checked={draft.startAtLogin}
            onChange={(startAtLogin) => setDraft({ ...draft, startAtLogin })}
          />
        </div>
      </div>

      <div className="settings-footer">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={busy}
          disabled={hasInvalidHours}
          onClick={() => onSave(draft)}
        >
          Save settings
        </Button>
      </div>
    </section>
  )
}
