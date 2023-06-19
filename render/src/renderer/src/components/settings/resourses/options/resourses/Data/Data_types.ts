import { ReducerActionType } from '@renderer/hooks/useSerial/resourses/reducer_Types'

export interface ControledInputProps {
  type: ReducerActionType
  isBoolean?: boolean
  isFloat?: boolean
}

export interface NumberInputProps {
  type: 'from' | 'to' | 'manualAngle' | 'maxDistance'
  isFloat?: boolean
  name?: string
  min: number
  max: number
}
