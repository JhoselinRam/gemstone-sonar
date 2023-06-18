import { ReducerAction } from '@renderer/hooks/useSerial/resourses/reducer_Types'
import { SerialState } from '@renderer/hooks/useSerial/useSerial_Types'
import { Dispatch, SetStateAction } from 'react'

export interface SettingsContextState extends SettingsPops {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export interface SettingsPops {
  state: SerialState
  dispatch: Dispatch<ReducerAction>
}
