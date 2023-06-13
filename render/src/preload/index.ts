import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { SendOptions } from '../main/services/serial_types'
import { SerialDataCallback, SerialInitCallback, SerialStatusCallback } from './index_types'

let dataListener: Electron.IpcRenderer

// Custom APIs for renderer
const api = {
  serial: {
    getPorts: (): Promise<string[]> => ipcRenderer.invoke('serial:getPorts'),
    openPort: (port: string): void => ipcRenderer.send('serial:open', port),
    status: (callback: SerialStatusCallback): Electron.IpcRenderer =>
      ipcRenderer.on('serial:status', callback),
    send: (options: SendOptions): void => ipcRenderer.send('serial:send', options),
    data: (callback: SerialDataCallback): void => {
      if (dataListener != null) dataListener.removeAllListeners('serial:data')
      dataListener = ipcRenderer.on('serial:data', callback)
    },
    init: (callback: SerialInitCallback): Electron.IpcRenderer =>
      ipcRenderer.on('serial:init', callback)
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
