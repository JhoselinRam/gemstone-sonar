import { SettingsContext } from '@renderer/components/settings/Settings_context'
import { useContext } from 'react'
import { ChildOptionProps } from '../../Options_types'
import StatusChip from '@renderer/components/status_chip/Status_Chip'

function PortOptions({ form }: ChildOptionProps): JSX.Element {
  const { state } = useContext(SettingsContext)

  function updatePorts(): void {
    state.ports.update()
  }

  function connectPort(): void {
    if (form.current == null) return

    const input = form.current.elements['portSelect'] as HTMLSelectElement
    const portName = input.value
    const portIndex = state.ports.names.indexOf(portName)

    if (portIndex === -1) return

    state.ports.open(portIndex)
  }

  return (
    <fieldset className="flex flex-row gap-8 w-full border p-2 rounded-md border-gray-600">
      <legend className="flex flex-row justify-between w-11/12 px-2">
        <p className="text-gray-500">Port</p>
        <div className="flex flex-row gap-3">
          <StatusChip
            bgEnable="blue"
            bgDisable="red"
            textDisable="white"
            textEnable="white"
            enable={!(state.status === 'error' || state.status === '')}
          >
            connected
          </StatusChip>
          <StatusChip
            bgEnable="blue"
            bgDisable="red"
            textDisable="white"
            textEnable="white"
            enable={state.ready}
          >
            ready
          </StatusChip>
        </div>
        <p></p>
      </legend>
      <div>
        <select name="portSelect">
          {state.ports.names.map((port) => (
            <option value={port} key={port}>
              {port}
            </option>
          ))}
        </select>
        <button type="button" onClick={connectPort}>
          connect
        </button>
      </div>
      <button type="button" onClick={updatePorts}>
        update
      </button>
    </fieldset>
  )
}

export default PortOptions
