export type UseSerial = [data: SerialData]

export interface SerialData {
  angle: number
  distance: number
}

export type SerialStatus = '' | 'ok' | 'error'
