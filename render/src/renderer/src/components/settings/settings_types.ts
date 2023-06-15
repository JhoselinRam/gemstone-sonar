import { ReducerAction } from '@renderer/hooks/useSerial/resourses/reducer_Types'
import { SerialState } from '@renderer/hooks/useSerial/useSerial_Types'

export interface SettingsProps {
  state: SerialState
  dispatch: React.Dispatch<ReducerAction>
}
