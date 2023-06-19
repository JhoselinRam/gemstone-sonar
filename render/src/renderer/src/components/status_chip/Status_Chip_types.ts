import { ReactNode } from 'react'

export interface StatusChipProps {
  children?: ReactNode
  enable: boolean
  bgEnable: string
  bgDisable: string
  textEnable: string
  textDisable: string
}
