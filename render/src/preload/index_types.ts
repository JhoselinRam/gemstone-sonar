import { InitialState } from '../main/services/serial_types'

interface SerialData {
  angle: number
  distance: number
}

export type SerialDataCallback = (_: Electron.IpcRendererEvent, data: SerialData) => void
export type SerialStatusCallback = (_: Electron.IpcRendererEvent, status: string) => void
export type SerialInitCallback = (_: Electron.IpcRendererEvent, init: InitialState) => void
