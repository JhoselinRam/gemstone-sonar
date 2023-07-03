import { useEffect, useReducer, useState } from 'react'
import { SerialData, SerialState, SerialStatus, UseSerial } from './useSerial_Types'
import { ReducerState, SerialReducer } from './resourses/reducer_Types'
import reducer, { floatMap } from './resourses/reducer'

const initialSerialState: ReducerState = {
  auto: false,
  delta: 0,
  delta_0: 0,
  delta_1: 0,
  enable: false,
  from: 0,
  manualAngle: 0,
  maxDistance: 0,
  to: 0
}

function useSerial(): UseSerial {
  // Data received from the arduino
  const [data, setData] = useState<SerialData>({ angle: 0, distance: 0 })
  const [ports, setPorts] = useState<string[]>([])
  const [status, setStatus] = useState<SerialStatus>('')
  const [ready, setReady] = useState<boolean>(false)

  // Data send to the arduino
  const [serialState, dispatch] = useReducer<SerialReducer>(reducer, initialSerialState)

  const state: SerialState = {
    ports: {
      names: ports,
      update: updatePorts,
      open: openPort
    },
    ready,
    status,
    ...serialState
  }

  //On data received
  function updateData(_, newData: SerialData): void {
    setData({
      ...newData,
      angle: floatMap(newData.angle, 0, 255, state.from, state.to)
    })
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

  //Gets the arduino initial state
  function initSatate(_, initialState: ReducerState): void {
    const payload = initialState as ReducerState
    setReady(true)
    setData({ angle: payload.from, distance: payload.maxDistance })
    dispatch({
      type: 'init',
      payload
    })
  }

  function openPort(index: number): void {
    if (ports[index] == null) return

    window.api.serial.openPort(ports[index])
  }

  //On first render
  useEffect(() => {
    updatePorts()
    window.api.serial.status(updateStatus)
    window.api.serial.init(initSatate)
  }, [])

  useEffect(() => {
    window.api.serial.data(updateData)
  })

  //------------------------------------------

  return [data, state, dispatch]
}

export default useSerial
