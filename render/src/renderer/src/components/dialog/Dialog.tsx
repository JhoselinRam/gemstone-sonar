import { useRef } from 'react'
import { DialogProps } from './Dialog_types'
import { useDialog } from 'react-aria'

function Dialog({ title, children, ...props }: DialogProps): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null)
  const { dialogProps, titleProps } = useDialog(props, ref)

  return (
    <div {...dialogProps} ref={ref}>
      {title && <h3 {...titleProps}>{title}</h3>}
      {children}
    </div>
  )
}

export default Dialog
