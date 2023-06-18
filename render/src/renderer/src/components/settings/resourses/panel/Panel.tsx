import { useContext, useEffect, useRef } from 'react'
import { SettingsContext } from '../../Settings_context'
import './Panel.css'
import Options from '../options/Options'

function Panel(): JSX.Element {
  const { open } = useContext(SettingsContext)
  const panelElement = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (panelElement.current == null) return

    panelElement.current.style.transform = open ? 'scale(1, 1)' : 'scale(0, 1)'
  }, [open])

  return (
    <div
      className="bg-zinc-900 max-w-md w-full fixed top-0 bottom-0 left-0 z-40 panel"
      ref={panelElement}
    >
      <Options />
    </div>
  )
}

export default Panel
