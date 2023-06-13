import { Reducer } from 'react'

export interface ReducerState {
  from: number
  to: number
  delta_0: number
  delta_1: number
  enable: boolean
  auto: boolean
  delta: number
  manualAngle: number
  maxDistance: number
}

export type ReducerActionType = Exclude<keyof ReducerState, 'delta_0' | 'delta_1'> | 'init'
export type ReducerPayloadType = number | boolean | ReducerState

export interface ReducerAction {
  type: ReducerActionType
  payload: ReducerPayloadType
}

export type Slice = {
  [k in ReducerActionType]: (state: ReducerState, payload: ReducerAction['payload']) => ReducerState
}

export type SerialReducer = Reducer<ReducerState, ReducerAction>
