import { ElectronAPI } from '@electron-toolkit/preload'
import { SendOptions } from '../main/services/serial_types'
import { SerialStatusCallback, SerialDataCallback, SerialInitCallback } from 'index_types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      serial: {
        getPorts: () => Promise<string[]>
        openPort: (port: string) => void
        status: (callback: SerialStatusCallback) => Electron.IpcRenderer
        send: (options: SendOptions) => void
        data: (callback: SerialDataCallback) => void
        init: (callback: SerialInitCallback) => Electron.IpcRenderer
      }
    }
  }
}
