import { ElectronAPI } from '@electron-toolkit/preload'
import { SendOptions } from '../main/services/serial_types'
import { SerialStatusCallback, SerialDataCallback, SerialInitCallback } from 'index_types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      serial: {
        getPorts: () => Promise<string[]>
        openPort: (port: string) => Promise<string>
        status: (callback: SerialStatusCallback) => Electron.IpcRenderer
        send: (options: SendOptions) => void
        data: (callback: SerialDataCallback) => Electron.IpcRenderer
        init: (callback: SerialInitCallback) => Electron.IpcRenderer
      }
    }
  }
}
