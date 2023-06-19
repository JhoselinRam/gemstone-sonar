import { useRef } from 'react'
import PortOptions from './resourses/Port/Port'
import DataOptions from './resourses/Data/Data'

function Options(): JSX.Element {
  const formElement = useRef<HTMLFormElement | null>(null)

  return (
    <form className="flex flex-col gap-2 w-full" ref={formElement}>
      <PortOptions form={formElement} />
      <DataOptions form={formElement} />
    </form>
  )
}

export default Options
