import { ReducerAction, ReducerState } from './reducer_Types'

export default function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case 'from': {
      if (typeof action.payload !== 'number') return state

      const newFrom = Math.round(clamp(action.payload, 0, state.to))

      window.api.serial.send({ directive: 'from', payload: newFrom })

      return {
        ...state,
        from: newFrom
      }
    }

    case 'to': {
      if (typeof action.payload !== 'number') return state

      const newTo = Math.round(clamp(action.payload, state.from, 180))

      window.api.serial.send({ directive: 'to', payload: newTo })

      return {
        ...state,
        to: newTo
      }
    }

    case 'manualAngle': {
      if (typeof action.payload !== 'number') return state
      if (state.auto) return state

      const newAngle = clamp(
        Math.round(floatMap(action.payload, state.from, state.to, 0, 255)),
        0,
        255
      )

      window.api.serial.send({ directive: 'angle', payload: newAngle })

      return {
        ...state,
        manualAngle: floatMap(newAngle, 0, 255, state.from, state.to)
      }
    }

    case 'auto': {
      if (typeof action.payload !== 'boolean') return state

      window.api.serial.send({ directive: 'auto', payload: action.payload })

      return {
        ...state,
        auto: action.payload
      }
    }

    case 'enable': {
      if (typeof action.payload !== 'boolean') return state

      window.api.serial.send({ directive: 'enable', payload: action.payload })

      return {
        ...state,
        enable: action.payload
      }
    }

    case 'delta': {
      if (typeof action.payload !== 'number') return state

      const newDelta = clamp(
        Math.round(floatMap(action.payload, state.delta_0, state.delta_1, 0, 255)),
        0,
        255
      )

      window.api.serial.send({ directive: 'delta', payload: newDelta })

      return {
        ...state,
        delta: floatMap(newDelta, 0, 255, state.delta_0, state.delta_1)
      }
    }

    case 'maxDistance': {
      if (typeof action.payload !== 'number') return state

      const newDistance = Math.round(clamp(action.payload, 0, 255))

      window.api.serial.send({ directive: 'distance', payload: newDistance })

      return {
        ...state,
        maxDistance: newDistance
      }
    }

    case 'init': {
      if (typeof action.payload !== 'object') return state

      return { ...state, ...action.payload }
    }
  }
}

//------------------------------------------
//------------------------------------------

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

export function floatMap(
  value: number,
  from_0: number,
  from_1: number,
  to_0: number,
  to_1: number
): number {
  const m = (to_1 - to_0) / (from_1 - from_0)
  const b = (to_0 * from_1 - to_1 * from_0) / (from_1 - from_0)

  return m * value + b
}
