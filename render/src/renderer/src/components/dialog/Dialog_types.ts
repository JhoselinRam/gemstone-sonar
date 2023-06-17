import { ReactNode } from 'react'
import { AriaDialogProps } from 'react-aria'

export interface DialogProps extends AriaDialogProps {
  title?: string
  children: ReactNode
}
