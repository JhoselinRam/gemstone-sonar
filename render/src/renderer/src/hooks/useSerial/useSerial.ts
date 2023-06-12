import { useEffect, useState } from 'react'
import { SerialData, SerialStatus } from './useSerial_Types'

function useSerial(): void {
  // Data received from the arduino
  const [data, setData] = useState<SerialData>({ angle: 0, distance: 0 })
  const [ports, setPorts] = useState<string[]>([])
  const [status, setStatus] = useState<SerialStatus>('')
  const [ready, setReady] = useState<boolean>(false)

  //On data received
  function updateData(_, newData: SerialData): void {
    setData(newData)
  }

  //On status received
  function updateStatus(_, newStatus: SerialStatus): void {
    setReady(false) //Always unset the ready state when the status change
    setStatus(newStatus)
  }

  //Gets the serial port names available
  async function updatePorts(): Promise<void> {
    const newPorts = await window.api.serial.getPorts()
    setPorts(newPorts)
  }

  //On first render
  useEffect(() => {
    updatePorts()
    window.api.serial.data(updateData)
    window.api.serial.status(updateStatus)
  }, [])
}

export default useSerial
