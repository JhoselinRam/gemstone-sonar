import { OverlayTriggerState } from '@react-stately/overlays'
import { ReactNode } from 'react'
import { AriaModalOverlayProps } from 'react-aria'

export interface ModalProps extends AriaModalOverlayProps {
  state: OverlayTriggerState
  child: ReactNode
}
