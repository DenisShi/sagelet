import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  Notification,
  powerMonitor,
  screen,
  Tray,
  type Point,
  type Rectangle
} from 'electron'
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

const PANEL_WIDTH = 680
const PANEL_HEIGHT = 720
const EDGE_TOLERANCE = 2
const EDGE_LEAVE_DELAY = 700

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
  private edgeWatcher: NodeJS.Timeout | null = null
  private windowAnimation: NodeJS.Timeout | null = null
  private edgeOpened = false
  private edgeLeftAt: number | null = null

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
    this.startEdgeWatcher()
    this.scheduler.start()

    app.on('before-quit', () => {
      this.quitting = true
      if (this.edgeWatcher) clearInterval(this.edgeWatcher)
      if (this.windowAnimation) clearInterval(this.windowAnimation)
      this.scheduler.stop()
    })
  }

  showWindow(): void {
    if (!this.window || this.window.isDestroyed()) this.createWindow()
    this.edgeOpened = false
    const bounds = this.getPanelBounds(screen.getCursorScreenPoint())
    this.window?.setBounds(bounds)
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
      nextNotificationAt: state.nextNotificationAt,
      pausedUntil: state.pausedUntil
    }
  }

  showNextCard(): BootstrapPayload {
    const currentCard = this.ensureCurrentCard()
    this.store.deferCard(currentCard.id)
    this.selectNextCard()
    return this.getBootstrap()
  }

  submitFeedback(feedback: CardFeedback): BootstrapPayload {
    const card = this.ensureCurrentCard()
    this.store.setFeedback(card.id, feedback)

    this.selectNextCard()
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
      ...this.getHiddenPanelBounds(screen.getPrimaryDisplay().bounds),
      show: false,
      frame: false,
      transparent: true,
      resizable: false,
      maximizable: false,
      fullscreenable: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      backgroundColor: '#00000000',
      title: 'Sagelet',
      icon: createAppIcon(),
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

  private startEdgeWatcher(): void {
    if (this.edgeWatcher) return

    this.edgeWatcher = setInterval(() => {
      if (!this.window || this.window.isDestroyed() || this.screenLocked) return

      const cursor = screen.getCursorScreenPoint()
      const display = screen.getDisplayNearestPoint(cursor)
      const atTopEdge = cursor.y - display.bounds.y <= EDGE_TOLERANCE

      if (!this.window.isVisible()) {
        if (atTopEdge) this.revealFromEdge(cursor)
        return
      }

      if (!this.edgeOpened) return

      const bounds = this.window.getBounds()
      const insideWindow =
        cursor.x >= bounds.x &&
        cursor.x <= bounds.x + bounds.width &&
        cursor.y >= bounds.y &&
        cursor.y <= bounds.y + bounds.height

      if (insideWindow || atTopEdge) {
        this.edgeLeftAt = null
        return
      }

      this.edgeLeftAt ??= Date.now()
      if (Date.now() - this.edgeLeftAt >= EDGE_LEAVE_DELAY) this.hideEdgeWindow()
    }, 100)
  }

  private revealFromEdge(cursor: Point): void {
    if (!this.window || this.window.isDestroyed()) return

    const target = this.getPanelBounds(cursor)
    this.edgeOpened = true
    this.edgeLeftAt = null
    this.window.setBounds({ ...target, y: target.y - target.height })
    this.window.showInactive()
    this.animateWindowTo(target.y)
  }

  private hideEdgeWindow(): void {
    if (!this.window || this.window.isDestroyed()) return

    this.edgeOpened = false
    this.edgeLeftAt = null
    const hidden = this.getHiddenPanelBounds(screen.getDisplayMatching(this.window.getBounds()).bounds)
    this.animateWindowTo(hidden.y, () => this.window?.hide())
  }

  private animateWindowTo(targetY: number, onComplete?: () => void): void {
    if (!this.window || this.window.isDestroyed()) return
    if (this.windowAnimation) clearInterval(this.windowAnimation)

    const startBounds = this.window.getBounds()
    const distance = targetY - startBounds.y
    const steps = 14
    let step = 0

    this.windowAnimation = setInterval(() => {
      if (!this.window || this.window.isDestroyed()) return
      step += 1
      const progress = step / steps
      const eased = 1 - (1 - progress) ** 3
      this.window.setBounds({ ...startBounds, y: Math.round(startBounds.y + distance * eased) })

      if (step < steps) return
      if (this.windowAnimation) clearInterval(this.windowAnimation)
      this.windowAnimation = null
      onComplete?.()
    }, 14)
  }

  private getPanelBounds(point: Point): Rectangle {
    const display = screen.getDisplayNearestPoint(point)
    const width = Math.min(PANEL_WIDTH, display.workArea.width - 24)
    const height = Math.min(PANEL_HEIGHT, display.workArea.height - 24)

    return {
      x: display.workArea.x + Math.round((display.workArea.width - width) / 2),
      y: display.workArea.y,
      width,
      height
    }
  }

  private getHiddenPanelBounds(displayBounds: Rectangle): Rectangle {
    const visibleBounds = this.getPanelBounds({
      x: displayBounds.x + Math.round(displayBounds.width / 2),
      y: displayBounds.y
    })
    return { ...visibleBounds, y: displayBounds.y - visibleBounds.height }
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
