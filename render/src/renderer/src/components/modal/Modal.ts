import { useModalOverlay, Overlay } from 'react-aria'
import { ModalProps } from './Modal_types'
import { useRef } from 'react'

function Modal({ child, state, ...props }: ModalProps){
  const ref = useRef<HTMLDivElement | null>(null)
  const {modalProps, underlayProps} = useModalOverlay(props, state, ref)

  return (
    <></>
  ) 
}

export default Modal
