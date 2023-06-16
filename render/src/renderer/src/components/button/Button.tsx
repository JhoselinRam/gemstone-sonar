import { useRef, Children, isValidElement, cloneElement } from 'react'
import { useButton } from 'react-aria'
import { ButtonProps } from './Button_types'

function Button({ className, children, ...props }: ButtonProps): JSX.Element {
  const ref = useRef<HTMLButtonElement | null>(null)
  const { buttonProps, isPressed } = useButton(props, ref)

  return (
    <button className={`${className} outline-none`} {...buttonProps} ref={ref}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) return cloneElement(child, { ...child.props, isPressed })
        return child
      })}
    </button>
  )
}

export default Button
