import { contextBridge, ipcRenderer } from 'electron'
import type { AppSettings, CardFeedback } from '../shared/models'
import type { SageletApi } from '../shared/contracts'

const api: SageletApi = {
  getBootstrap: () => ipcRenderer.invoke('learning:get-bootstrap'),
  showNextCard: () => ipcRenderer.invoke('learning:show-next-card'),
  submitFeedback: (feedback: CardFeedback) =>
    ipcRenderer.invoke('learning:submit-feedback', feedback),
  updateSettings: (settings: AppSettings) => ipcRenderer.invoke('settings:update', settings),
  pauseForMinutes: (minutes: number) => ipcRenderer.invoke('scheduler:pause', minutes),
  hideWindow: () => ipcRenderer.invoke('window:hide'),
  onCardChanged: (callback) => {
    const listener = (): void => callback()
    ipcRenderer.on('card:changed', listener)
    return () => ipcRenderer.removeListener('card:changed', listener)
  }
}

contextBridge.exposeInMainWorld('sagelet', api)
