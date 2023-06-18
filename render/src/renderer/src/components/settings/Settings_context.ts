import { createContext } from 'react'
import { SettingsContextState } from './Settings_types'

export const SettingsContext = createContext<SettingsContextState>({} as SettingsContextState)
