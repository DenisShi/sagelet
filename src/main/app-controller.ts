import { app, BrowserWindow, Menu, nativeImage, Notification, powerMonitor, Tray } from 'electron'
import { join } from 'node:path'
import type {
  AppSettings,
  CardFeedback,
  LearningCard
} from '../shared/models'
import { appSettingsSchema } from '../shared/models'
import type { BootstrapPayload } from '../shared/contracts'
import { englishCards } from './content/english'
import { ContentEngine } from './services/content-engine'
import { JsonStore } from './services/json-store'
import {
  calculateNextNotificationAt,
  NotificationScheduler
} from './services/scheduler'

const trayIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="g" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
        <stop stop-color="#7C5CFF"/>
        <stop offset="1" stop-color="#37C6A5"/>
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="54" height="54" rx="17" fill="url(#g)"/>
    <text x="32" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="39" font-weight="700" fill="white">S</text>
  </svg>
`

const createAppIcon = () => {
  const iconPath = app.isPackaged
    ? join(process.resourcesPath, 'icon.png')
    : join(process.cwd(), 'resources/icon.png')
  const icon = nativeImage.createFromPath(iconPath)

  if (!icon.isEmpty()) return icon
  return nativeImage.createFromDataURL(
    `data:image/svg+xml;base64,${Buffer.from(trayIconSvg).toString('base64')}`
  )
}

export class AppController {
  private window: BrowserWindow | null = null
  private tray: Tray | null = null
  private readonly store: JsonStore
  private readonly contentEngine = new ContentEngine(englishCards)
  private readonly scheduler: NotificationScheduler
  private screenLocked = false
  private quitting = false

  constructor() {
    this.store = new JsonStore(join(app.getPath('userData'), 'sagelet-state.json'))
    this.scheduler = new NotificationScheduler({
      store: this.store,
      onDue: () => this.showScheduledNotification(),
      isScreenLocked: () => this.screenLocked
    })
  }

  initialize(): void {
    this.configureLoginItem(this.store.getState().settings.startAtLogin)
    this.createWindow()
    this.createTray()
    this.bindPowerEvents()
    this.scheduler.start()

    app.on('before-quit', () => {
      this.quitting = true
      this.scheduler.stop()
    })
  }

  showWindow(): void {
    if (!this.window || this.window.isDestroyed()) this.createWindow()
    this.window?.show()
    this.window?.focus()
  }

  hideWindow(): void {
    this.window?.hide()
  }

  getBootstrap(): BootstrapPayload {
    const currentCard = this.ensureCurrentCard()
    const state = this.store.getState()

    return {
      settings: state.settings,
      currentCard,
      history: state.history.slice(0, 30),
      nextNotificationAt: state.nextNotificationAt,
      pausedUntil: state.pausedUntil
    }
  }

  showNextCard(): BootstrapPayload {
    this.selectNextCard()
    return this.getBootstrap()
  }

  submitFeedback(feedback: CardFeedback): BootstrapPayload {
    const card = this.ensureCurrentCard()
    this.store.setFeedback(card.id, feedback)

    if (feedback === 'understood') this.selectNextCard()
    this.notifyRenderer()
    return this.getBootstrap()
  }

  updateSettings(input: AppSettings): BootstrapPayload {
    const settings = appSettingsSchema.parse(input)
    this.store.updateSettings(settings)
    this.store.setPausedUntil(null)
    this.store.setNextNotificationAt(calculateNextNotificationAt(new Date(), settings))
    this.configureLoginItem(settings.startAtLogin)

    const currentCard = this.contentEngine.getById(this.store.getState().currentCardId)
    if (!currentCard || currentCard.level !== settings.level) this.selectNextCard()

    this.notifyRenderer()
    return this.getBootstrap()
  }

  pauseForMinutes(minutes: number): BootstrapPayload {
    const safeMinutes = Math.max(1, Math.min(minutes, 24 * 60))
    const pausedUntil = new Date(Date.now() + safeMinutes * 60_000)
    this.store.setPausedUntil(pausedUntil)
    this.store.setNextNotificationAt(pausedUntil)
    this.notifyRenderer()
    return this.getBootstrap()
  }

  showTestNotification(): { shown: boolean } {
    return { shown: this.showNotification(this.ensureCurrentCard()) }
  }

  private createWindow(): void {
    this.window = new BrowserWindow({
      width: 1160,
      height: 760,
      minWidth: 940,
      minHeight: 640,
      show: false,
      backgroundColor: '#f4f5fb',
      title: 'Sagelet',
      icon: createAppIcon(),
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1c1b2f',
        symbolColor: '#ffffff',
        height: 42
      },
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    })

    this.window.on('close', (event) => {
      if (this.quitting) return
      event.preventDefault()
      this.window?.hide()
    })

    this.window.once('ready-to-show', () => this.window?.show())

    if (process.env.ELECTRON_RENDERER_URL) {
      void this.window.loadURL(process.env.ELECTRON_RENDERER_URL)
    } else {
      void this.window.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }

  private createTray(): void {
    this.tray = new Tray(createAppIcon().resize({ width: 20, height: 20 }))
    this.tray.setToolTip('Sagelet · micro-learning companion')
    this.tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: 'Open Sagelet', click: () => this.showWindow() },
        { label: 'Show next card', click: () => this.showNextCard() },
        { type: 'separator' },
        { label: 'Pause for 1 hour', click: () => this.pauseForMinutes(60) },
        { type: 'separator' },
        {
          label: 'Exit',
          click: () => {
            this.quitting = true
            app.quit()
          }
        }
      ])
    )

    this.tray.on('click', () => {
      if (this.window?.isVisible()) this.hideWindow()
      else this.showWindow()
    })
  }

  private bindPowerEvents(): void {
    powerMonitor.on('lock-screen', () => {
      this.screenLocked = true
    })
    powerMonitor.on('unlock-screen', () => {
      this.screenLocked = false
      void this.scheduler.tick()
    })
    powerMonitor.on('resume', () => void this.scheduler.tick())
  }

  private ensureCurrentCard(): LearningCard {
    const state = this.store.getState()
    const currentCard = this.contentEngine.getById(state.currentCardId)
    if (currentCard && currentCard.level === state.settings.level) return currentCard
    return this.selectNextCard(false)
  }

  private selectNextCard(
    notifyRenderer = true,
    source: 'manual' | 'notification' = 'manual'
  ): LearningCard {
    const state = this.store.getState()
    const card = this.contentEngine.selectNext({
      settings: state.settings,
      progress: state.progress,
      currentCardId: state.currentCardId
    })
    this.store.setCurrentCard(card, source)
    if (notifyRenderer) this.notifyRenderer()
    return card
  }

  private showScheduledNotification(): void {
    const card = this.selectNextCard(true, 'notification')
    this.showNotification(card)
  }

  private showNotification(card: LearningCard): boolean {
    if (!Notification.isSupported()) return false

    const notification = new Notification({
      title: `Sagelet · English ${card.level}`,
      body: `${card.title} — ${card.notificationText}`,
      icon: createAppIcon(),
      silent: false
    })
    notification.on('click', () => this.showWindow())
    notification.show()
    return true
  }

  private configureLoginItem(openAtLogin: boolean): void {
    if (process.platform !== 'win32') return
    app.setLoginItemSettings({ openAtLogin })
  }

  private notifyRenderer(): void {
    if (!this.window || this.window.isDestroyed()) return
    this.window.webContents.send('card:changed')
  }
}
