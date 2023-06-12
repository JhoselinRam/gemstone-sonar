import { useReducer, useState } from 'react'
import { UseSerial, SerialReducer, SerialState, SerialData } from './useSerial_types'
import reducer from './serial-reducer'

const initialState: SerialState = {
  connected: false,
  ready: false,
  from: 0,
  to: 0,
  delta: 0,
  angle: 0,
  auto: false,
  delta_0: 0,
  delta_1: 0,
  distance: 0,
  enable: false
}

function useSerial(): UseSerial {
  const [serial, dispatch] = useReducer<SerialReducer>(reducer, initialState)
  const [data, setData] = useState<SerialData>({ angle: initialState.from, distance: 0 })

  return {
    serial,
    data,
    dispatch
  }
}

export default useSerial
