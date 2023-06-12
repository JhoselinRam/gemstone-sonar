import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

function App(): JSX.Element {
  const [serialPorts, setSerialPorts] = useState<string[]>([])
  const [serialStatus, setSeriaStatus] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [delta, setDelta] = useState(25)
  const [angle, setAngle] = useState(0)
  const [from, setFrom] = useState(180)
  const [to, setTo] = useState(0)
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<{ distance: number; angle: number }>({
    angle: 30,
    distance: 0
  })

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

  function serialStart(e: ChangeEvent<HTMLInputElement>): void {
    window.api.serial.send({
      directive: 'enable',
      payload: e.target.checked
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

  function serialFrom(e: ChangeEvent<HTMLInputElement>): void {
    setFrom(parseInt(e.target.value))
    window.api.serial.send({
      directive: 'from',
      payload: parseInt(e.target.value)
    })
  }

  function serialTo(e: ChangeEvent<HTMLInputElement>): void {
    setTo(parseInt(e.target.value))
    window.api.serial.send({
      directive: 'to',
      payload: parseInt(e.target.value)
    })
  }

  function getData(_, data: { angle: number; distance: number }): void {
    console.dir(data)
    setData({
      angle: data.angle,
      distance: data.distance
    })
  }

  function getInitialState(_, state: unknown): void {
    setReady(true)
  }

  useEffect(() => {
    savePortNames()
    window.api.serial.status(getSerialStatus)
    window.api.serial.data(getData)
    window.api.serial.init(getInitialState)
  }, [])

  useEffect(() => {
    if (serialStatus === 'ok') setDisabled(false)
    if (serialStatus === 'error') setDisabled(true)
  }, [serialStatus])

  return (
    <div className="p-1">
      <h2>Angle: {data.angle}</h2>
      <h2>Distance: {data.distance}</h2>
      <div className="flex flex-row gap-2">
        <button
          className="border px-1 my-2 border-gray-600 rounded-md"
          role="button"
          onClick={savePortNames}
        >
          Get Serial Ports
        </button>
        <p>{serialStatus}</p>
        <p>{ready ? 'ready' : 'not yet'}</p>
      </div>
      <label htmlFor="start">Start</label>
      <input type="checkbox" name="start" id="start" onChange={serialStart} disabled={disabled} />
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
      <label htmlFor="from">From {from}</label>
      <input
        type="range"
        name="from"
        id="from"
        min={0}
        max={180}
        step={1}
        defaultValue={0}
        onChange={serialFrom}
        disabled={disabled}
      />
      <label htmlFor="to">To {to}</label>
      <input
        type="range"
        name="to"
        id="to"
        min={0}
        max={180}
        step={1}
        defaultValue={0}
        onChange={serialTo}
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
