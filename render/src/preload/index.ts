import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  serial: {
    getPorts: (): Promise<string[]> => ipcRenderer.invoke('serial:getPorts'),
    openPort: (port: string): void => ipcRenderer.send('serial:open', port),
    status: (
      callback: (_: Electron.IpcRendererEvent, status: string) => void
    ): Electron.IpcRenderer => ipcRenderer.on('serial:status', callback),
    start: (): void => ipcRenderer.send('serial:start'),
    stop: (): void => ipcRenderer.send('serial:stop')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
