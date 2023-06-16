import { ReactNode } from 'react'
import { AriaButtonProps } from 'react-aria'

export interface ButtonProps extends AriaButtonProps<'button'> {
  className: string
  children: ReactNode
}
