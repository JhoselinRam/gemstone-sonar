import { useContext, useEffect, useRef } from 'react'
import PortOptions from './resourses/Port/Port'
import DataOptions from './resourses/Data/Data'
import { SettingsContext } from '../../Settings_context'

function Options(): JSX.Element {
  const { open } = useContext(SettingsContext)
  const formElement = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (formElement.current == null) return

    if (open) {
      formElement.current.style.transition = 'opacity 0.1s ease-in-out 0.1s'
      formElement.current.style.opacity = '1'
      return
    }
    formElement.current.style.transition = 'none'
    formElement.current.style.opacity = '0'
  }, [open])

  return (
    <form className="flex flex-col gap-2 w-full" ref={formElement}>
      <PortOptions form={formElement} />
      <DataOptions form={formElement} />
    </form>
  )
}

export default Options
