import { MouseEvent, useEffect, useState } from 'react'

function App(): JSX.Element {
  const [serialPorts, setSerialPorts] = useState<string[]>([])
  const [serialStatus, setSeriaStatus] = useState('')
  const [disabled, setDisabled] = useState(true)

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
    window.api.serial.start()
  }

  function serialStop(): void {
    window.api.serial.stop()
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
