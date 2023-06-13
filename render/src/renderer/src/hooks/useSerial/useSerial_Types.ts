import { ReducerAction, ReducerState } from './resourses/reducer_Types'

export type UseSerial = [
  data: SerialData,
  state: SerialState,
  dispatch: React.Dispatch<ReducerAction>
]

export interface SerialData {
  angle: number
  distance: number
}

export type SerialStatus = '' | 'ok' | 'error'

export interface SerialState extends ReducerState {
  ports: {
    update: () => void
    names: string[]
    open: (index: number) => void
  }
  status: SerialStatus
  ready: boolean
}
