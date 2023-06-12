import { Reducer } from 'react'

export interface UseSerial {
  serial: SerialState
  data: SerialData
  dispatch: React.Dispatch<SerialAction>
}

export type SerialReducer = Reducer<SerialState, SerialAction>

export interface SerialData {
  angle: number
  distance: number
}

export interface SerialState extends InitialState {
  connected: boolean
  ready: boolean
}

export interface SerialAction {
  type: string
  payload: number
}

export type ActionTypes = 'connect' | 'update' | 'delta' | 'angle' | 'from' | 'to'

export interface InitialState {
  from: number
  to: number
  delta_0: number
  delta_1: number
  enable: boolean
  auto: boolean
  delta: number
  angle: number
  distance: number
}
