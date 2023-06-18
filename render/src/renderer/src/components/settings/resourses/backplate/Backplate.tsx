import { useContext } from 'react'
import { SettingsContext } from '../../Settings_context'

function Backplate(): JSX.Element {
  const { open, setOpen } = useContext(SettingsContext)

  function close(): void {
    setOpen(false)
  }

  return (
    <div
      className="bg-black fixed top-0 bottom-0 left-0 right-0 bg-opacity-40 z-30"
      style={{ display: open ? 'block' : 'none' }}
      onClick={close}
    ></div>
  )
}

export default Backplate
