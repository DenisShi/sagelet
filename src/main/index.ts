import { app, ipcMain } from 'electron'
import { AppController } from './app-controller'

const hasSingleInstanceLock = app.requestSingleInstanceLock()

if (!hasSingleInstanceLock) {
  app.quit()
} else {
  app.setAppUserModelId('com.sagelet.desktop')

  void app.whenReady().then(() => {
    const controller = new AppController()
    controller.initialize()

    ipcMain.handle('learning:get-bootstrap', () => controller.getBootstrap())
    ipcMain.handle('learning:show-next-card', () => controller.showNextCard())
    ipcMain.handle('learning:submit-feedback', (_event, feedback) =>
      controller.submitFeedback(feedback)
    )
    ipcMain.handle('settings:update', (_event, settings) => controller.updateSettings(settings))
    ipcMain.handle('scheduler:pause', (_event, minutes) => controller.pauseForMinutes(minutes))
    ipcMain.handle('notification:test', () => controller.showTestNotification())
    ipcMain.handle('window:hide', () => controller.hideWindow())

    app.on('second-instance', () => controller.showWindow())
    app.on('activate', () => controller.showWindow())
  })
}
