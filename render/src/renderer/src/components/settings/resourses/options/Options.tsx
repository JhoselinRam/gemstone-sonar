import { useContext, useRef } from 'react'
import { SettingsContext } from '../../Settings_context'

function Options(): JSX.Element {
  const { state } = useContext(SettingsContext)
  const selectPortElement = useRef<HTMLSelectElement | null>(null)

  function updatePorts(): void {
    state.ports.update()
  }

  function connectPort(): void {
    if (selectPortElement.current == null) return

    const portName = selectPortElement.current.value
    const portIndex = state.ports.names.indexOf(portName)

    if (portIndex === -1) return

    state.ports.open(portIndex)
  }

  return (
    <form className="flex flex-col gap-2 text-gray-400 w-full">
      <fieldset className="flex flex-row gap-8 w-full">
        <legend className="flex flex-row justify-between w-full">
          <p>Port</p>
          <div className="flex flex-row gap-2">
            <p>connected {state.status === 'error' || state.status === '' ? 'x' : '✓'}</p>
            <p>ready {state.ready ? '✓' : 'x'}</p>
          </div>
        </legend>
        <div>
          <select ref={selectPortElement}>
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
    </form>
  )
}

export default Options
