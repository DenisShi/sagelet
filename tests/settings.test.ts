import { describe, expect, it } from 'vitest'
import { appSettingsSchema, defaultSettings } from '../src/shared/models'

describe('app settings', () => {
  it('adds the light theme when loading settings saved by an older version', () => {
    const { themeMode: _themeMode, ...legacySettings } = defaultSettings

    expect(appSettingsSchema.parse(legacySettings).themeMode).toBe('light')
  })

  it('preserves an explicitly selected dark theme', () => {
    const settings = appSettingsSchema.parse({ ...defaultSettings, themeMode: 'dark' })

    expect(settings.themeMode).toBe('dark')
  })
})
