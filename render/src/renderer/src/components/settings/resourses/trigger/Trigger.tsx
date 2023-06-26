import GearIcon from '@renderer/components/svg_icons/gear/Gear'
import { useContext } from 'react'
import { SettingsContext } from '../../Settings_context'
import './Trigger.css'

function Trigger(): JSX.Element {
  const { setOpen } = useContext(SettingsContext)

  function toggle(): void {
    setOpen((current) => !current)
  }

  return (
    <>
      <button className="m-2 outline-none self-start" type="button" onClick={toggle}>
        <GearIcon size="2rem" glowOnHover fill="#232d3b"></GearIcon>
      </button>
    </>
  )
}

export default Trigger
