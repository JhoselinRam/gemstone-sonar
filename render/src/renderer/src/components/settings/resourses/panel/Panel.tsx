import { KeyboardEvent, useContext, useEffect, useRef } from 'react'
import { SettingsContext } from '../../Settings_context'
import './Panel.css'
import Options from '../options/Options'
import Cancel from '@renderer/components/svg_icons/cancel/Cancel'

function Panel(): JSX.Element {
  const { open, setOpen } = useContext(SettingsContext)
  const panelElement = useRef<HTMLDivElement | null>(null)
  const headerElement = useRef<HTMLHeadElement | null>(null)

  useEffect(() => {
    if (panelElement.current == null) return
    if (headerElement.current == null) return

    panelElement.current.style.transform = open ? 'scale(1, 1)' : 'scale(0, 1)'
    if (open) {
      panelElement.current.focus()

      headerElement.current.style.transition = 'opacity 0.1s ease-in-out 0.1s'
      headerElement.current.style.opacity = '1'
      return
    }
    headerElement.current.style.transition = 'none'
    headerElement.current.style.opacity = '0'
  }, [open])

  function close(): void {
    setOpen(false)
  }

  function onEsc(e: KeyboardEvent): void {
    if (panelElement.current == null) return
    if (e.target === panelElement.current && e.key === 'Escape') close()
  }

  return (
    <div
      className="bg-zinc-900 max-w-xs w-full fixed top-0 bottom-0 left-0 z-40 flex flex-col text-gray-400 p-2 panel"
      ref={panelElement}
      onKeyDown={onEsc}
      tabIndex={0}
    >
      <header className="flex flex-row justify-between mb-3" ref={headerElement}>
        <p></p>
        <h1>Settings</h1>
        <button type="button" onClick={close} className="closeButton">
          <Cancel size="1.5rem" fill="#717780" glowOnHover />
        </button>
      </header>
      <Options />
    </div>
  )
}

export default Panel
