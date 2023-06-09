import { ElectronAPI } from '@electron-toolkit/preload'
import { SendOptions } from '../main/services/serial_types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      serial: {
        getPorts: () => Promise<string[]>
        openPort: (port: string) => Promise<string>
        status: (
          callback: (_: Electron.IpcRendererEvent, status: string) => void
        ) => Electron.IpcRenderer
        send: (options: SendOptions) => void
      }
    }
  }
}
