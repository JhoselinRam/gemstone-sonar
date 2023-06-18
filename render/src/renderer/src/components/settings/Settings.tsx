import { useState } from 'react'
import Trigger from './resourses/trigger/Trigger'
import { SettingsContext } from './Settings_context'
import Backplate from './resourses/backplate/Backplate'
import Panel from './resourses/panel/Panel'
import { SettingsPops } from './Settings_types'

function Settings({ dispatch, state }: SettingsPops): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <SettingsContext.Provider value={{ open, setOpen, dispatch, state }}>
      <Trigger />
      <Backplate />
      <Panel />
    </SettingsContext.Provider>
  )
}

export default Settings
