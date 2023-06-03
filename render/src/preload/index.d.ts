import { ElectronAPI } from '@electron-toolkit/preload'

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
        start: () => void
        stop: () => void
      }
    }
  }
}
