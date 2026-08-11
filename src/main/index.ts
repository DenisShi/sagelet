import { app, ipcMain } from 'electron'
import { z } from 'zod'
import { cardFeedbackSchema } from '../shared/models'
import { AppController } from './app-controller'

const pauseMinutesSchema = z.number().int().min(1).max(1440)
const lessonPositionSchema = z.number().int().positive()

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
    ipcMain.handle('learning:show-card', (_event, position) =>
      controller.showLessonCard(lessonPositionSchema.parse(position))
    )
    ipcMain.handle('learning:submit-feedback', (_event, feedback) =>
      controller.submitFeedback(cardFeedbackSchema.parse(feedback))
    )
    ipcMain.handle('settings:update', (_event, settings) => controller.updateSettings(settings))
    ipcMain.handle('scheduler:pause', (_event, minutes) =>
      controller.pauseForMinutes(pauseMinutesSchema.parse(minutes))
    )
    ipcMain.handle('window:hide', () => controller.hideWindow())

    app.on('second-instance', () => controller.showWindow())
    app.on('activate', () => controller.showWindow())
  })
}
