import { ChangeEvent } from 'react'
import useSerial from './hooks/useSerial/useSerial'

function App(): JSX.Element {
  const [data, state, dispatch] = useSerial()

  function open(index: number): void {
    state.ports.open(index)
  }

  function enable(): void {
    dispatch({
      type: 'enable',
      payload: !state.enable
    })
  }

  function auto(): void {
    dispatch({
      type: 'auto',
      payload: !state.auto
    })
  }

  function delta(e: ChangeEvent<HTMLInputElement>): void {
    const delta = parseFloat(e.target.value)
    dispatch({
      type: 'delta',
      payload: delta
    })
  }

  function from(e: ChangeEvent<HTMLInputElement>): void {
    const from = parseFloat(e.target.value)
    dispatch({
      type: 'from',
      payload: from
    })
  }

  function to(e: ChangeEvent<HTMLInputElement>): void {
    const to = parseFloat(e.target.value)
    dispatch({
      type: 'to',
      payload: to
    })
  }

  function manual(e: ChangeEvent<HTMLInputElement>): void {
    const manual = parseFloat(e.target.value)
    dispatch({
      type: 'manualAngle',
      payload: manual
    })
  }

  return (
    <div className="p-1">
      <h1>Distance: {data.distance}</h1>
      <h1>Angle: {data.angle.toFixed(2)}</h1>
      <button
        className="border border-gray-700 rounded-md py-0 px-1 active:bg-blue-400"
        onClick={state.ports.update}
      >
        Update
      </button>
      <div className="flex flex-row gap-2">
        <p>{state.status}</p>
        <p>{state.ready && 'ready'}</p>
      </div>
      <div className="flex flex-row gap-1">
        <div>
          <label htmlFor="enable">Enable</label>
          <input
            type="checkbox"
            name="enable"
            id="enable"
            checked={state.enable}
            disabled={!state.ready}
            onChange={enable}
          />
        </div>
        <div>
          <label htmlFor="auto">Auto</label>
          <input
            type="checkbox"
            name="auto"
            id="auto"
            checked={state.auto}
            disabled={!state.ready}
            onChange={auto}
          />
        </div>
        <div>
          <label htmlFor="delta">Delta {state.delta.toFixed(2)}</label>
          <input
            type="range"
            name="delta"
            id="delta"
            min={state.delta_0}
            max={state.delta_1}
            step={1}
            defaultValue={state.delta}
            disabled={!state.ready}
            onInput={delta}
          />
        </div>
        <div>
          <label htmlFor="from">Delta {state.from.toFixed(2)}</label>
          <input
            type="range"
            name="from"
            id="from"
            min={0}
            max={180}
            step={1}
            defaultValue={state.from}
            disabled={!state.ready}
            onInput={from}
          />
        </div>
        <div>
          <label htmlFor="to">Delta {state.to.toFixed(2)}</label>
          <input
            type="range"
            name="to"
            id="to"
            min={0}
            max={180}
            step={1}
            defaultValue={state.to}
            disabled={!state.ready}
            onInput={to}
          />
        </div>
        <div>
          <label htmlFor="manual">Manual {state.manualAngle.toFixed(2)}</label>
          <input
            type="range"
            name="manual"
            id="manual"
            min={state.from}
            max={state.to}
            step={1}
            defaultValue={state.manualAngle}
            disabled={!state.ready}
            onInput={manual}
          />
        </div>
      </div>
      <ul className="w-1/3 grid grid-cols-3 gap-1">
        {state.ports.names.map((port, index) => (
          <li
            key={port}
            className="hover:bg-red-400 cursor-pointer"
            onClick={(): void => open(index)}
          >
            {port}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
