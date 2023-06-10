import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

function App(): JSX.Element {
  const [serialPorts, setSerialPorts] = useState<string[]>([])
  const [serialStatus, setSeriaStatus] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [delta, setDelta] = useState(25)
  const [angle, setAngle] = useState(0)

  async function savePortNames(): Promise<void> {
    const names = await window.api.serial.getPorts()
    setSerialPorts(names)
  }

  async function openPort(e: MouseEvent): Promise<void> {
    const element = e.target as HTMLLIElement
    await window.api.serial.openPort(element.innerHTML)
  }

  function getSerialStatus(_, status: string): void {
    setSeriaStatus(status)
  }

  function serialStart(): void {
    window.api.serial.send({
      directive: 'enable',
      payload: true
    })
  }

  function serialStop(): void {
    window.api.serial.send({
      directive: 'enable',
      payload: false
    })
  }

  function serialAuto(e: ChangeEvent<HTMLInputElement>): void {
    window.api.serial.send({
      directive: 'auto',
      payload: e.target.checked
    })
  }

  function serialDelta(e: ChangeEvent<HTMLInputElement>): void {
    setDelta(parseInt(e.target.value))
    window.api.serial.send({
      directive: 'delta',
      payload: parseInt(e.target.value)
    })
  }

  function serialAngle(e: ChangeEvent<HTMLInputElement>): void {
    setAngle(parseInt(e.target.value))
    window.api.serial.send({
      directive: 'angle',
      payload: parseInt(e.target.value)
    })
  }

  useEffect(() => {
    savePortNames()
    window.api.serial.status(getSerialStatus)
  }, [])

  useEffect(() => {
    if (serialStatus === 'ok') setDisabled(false)
    if (serialStatus === 'error') setDisabled(true)
  }, [serialStatus])

  return (
    <div className="p-1">
      <div className="flex flex-row gap-2">
        <button
          className="border px-1 my-2 border-gray-600 rounded-md"
          role="button"
          onClick={savePortNames}
        >
          Get Serial Ports
        </button>
        <p>{serialStatus}</p>
      </div>
      <button
        className="border px-1 my-2 border-gray-600 rounded-md disabled:text-gray-500 disabled:border-gray-300"
        role="button"
        disabled={disabled}
        onClick={serialStart}
      >
        Start
      </button>
      <button
        className="border px-1 my-2 border-gray-600 rounded-md disabled:text-gray-500 disabled:border-gray-300"
        role="button"
        disabled={disabled}
        onClick={serialStop}
      >
        Stop
      </button>
      <label htmlFor="auto">Auto</label>
      <input type="checkbox" name="auto" id="auto" onInput={serialAuto} disabled={disabled} />
      <label htmlFor="delta">Delta {delta}</label>
      <input
        type="range"
        name="delta"
        id="delta"
        min={0}
        max={255}
        step={1}
        defaultValue={25}
        onChange={serialDelta}
        disabled={disabled}
      />
      <label htmlFor="angle">Angle {angle}</label>
      <input
        type="range"
        name="angle"
        id="angle"
        min={0}
        max={255}
        step={1}
        defaultValue={0}
        onChange={serialAngle}
        disabled={disabled}
      />
      <ul className="w-1/3 grid grid-cols-3 gap-1">
        {serialPorts.map((port) => (
          <li key={port} onClick={openPort} className="hover:bg-red-400 cursor-pointer">
            {port}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
