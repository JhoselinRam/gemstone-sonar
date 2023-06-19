import { SettingsContext } from '@renderer/components/settings/Settings_context'
import { useContext } from 'react'
import { ChildOptionProps } from '../../Options_types'

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
    <fieldset className="flex flex-row gap-8 w-full border">
      <legend className="flex flex-row justify-between w-11/12">
        <p>Port</p>
        <div className="flex flex-row gap-2">
          <p>connected {state.status === 'error' || state.status === '' ? 'x' : '✓'}</p>
          <p>ready {state.ready ? '✓' : 'x'}</p>
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
