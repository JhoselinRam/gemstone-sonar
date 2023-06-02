import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const [serialPorts, setSerialPorts] = useState<string[]>([])

  async function savePortNames(): Promise<void> {
    const names = await window.api.serial.getPorts()
    setSerialPorts(names)
  }

  useEffect(() => {
    savePortNames()
  }, [])

  return (
    <div className="p-1">
      <button
        className="border px-1 my-2 border-gray-600 rounded-md"
        role="button"
        onClick={savePortNames}
      >
        Get Serial Ports
      </button>
      <ul className="w-1/3 grid grid-cols-3">
        {serialPorts.map((port) => (
          <li key={port}>{port}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
