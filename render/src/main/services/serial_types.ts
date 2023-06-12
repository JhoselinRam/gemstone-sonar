export interface SendOptions {
  directive: Directives
  payload: boolean | number
}

export type Directives = 'enable' | 'auto' | 'delta' | 'angle' | 'from' | 'to' | 'distance'

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
