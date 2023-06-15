import { SettingsProps } from './settings_types'
import GearIcon from '../GearIcon/GearIcon'
import { useButton } from '@react-aria/button'

function Settings({ dispatch, state }: SettingsProps): JSX.Element {
  const {} = useButton()

  return (
    <>
      <button className="w-8 h-8">
        <GearIcon fill="black" fillOpacity="0.3" />
      </button>
    </>
  )
}

export default Settings
