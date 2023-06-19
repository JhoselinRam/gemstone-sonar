import { FocusEvent, KeyboardEvent, useContext, useEffect } from 'react'
import { ChildOptionProps } from '../../Options_types'
import { SettingsContext } from '@renderer/components/settings/Settings_context'
import { ControledInputProps, NumberInputProps } from './Data_types'

function DataOptions({ form }: ChildOptionProps): JSX.Element {
  const { state, dispatch } = useContext(SettingsContext)

  useEffect(() => {
    if (form.current == null) return
    ;(form.current.elements['from'] as HTMLInputElement).value = state.from.toString()
    ;(form.current.elements['to'] as HTMLInputElement).value = state.to.toString()
    ;(form.current.elements['manual_number'] as HTMLInputElement).value =
      state.manualAngle.toFixed(2)
    ;(form.current.elements['distance_number'] as HTMLInputElement).value =
      state.maxDistance.toFixed(1)
  }, [state.from, state.to, state.manualAngle, state.maxDistance])

  function setControledInput({
    type,
    isBoolean = false,
    isFloat = false
  }: ControledInputProps): void {
    if (form.current == null) return

    const input = form.current.elements[type] as HTMLInputElement
    const newValue = isBoolean
      ? input.checked
      : isFloat
      ? parseFloat(input.value)
      : parseInt(input.value)

    if (newValue === state[type]) return

    dispatch({
      type,
      payload: newValue
    })
  }

  function setNumberInput({ type, min, max, isFloat = false, name }: NumberInputProps): void {
    if (form.current == null) return

    const elementName = name == null ? type : name

    const input = form.current.elements[elementName] as HTMLInputElement
    let newValue = isFloat ? parseFloat(input.value) : parseInt(input.value)

    newValue = newValue > max ? max : newValue < min ? min : newValue

    if (newValue === state[type]) return

    dispatch({
      type,
      payload: newValue
    })
  }

  function enterNumberInput(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === 'Intro') (e.target as HTMLInputElement).blur()
  }

  function selectOnFocus(e: FocusEvent): void {
    ;(e.target as HTMLInputElement).select()
  }

  return (
    <fieldset className="border">
      <legend>Data</legend>
      <div className="flex flex-row gap-6">
        <div>
          <label htmlFor="enable">Enable</label>
          <input
            type="checkbox"
            name="enable"
            id="enable"
            checked={state.enable}
            onChange={(): void => setControledInput({ type: 'enable', isBoolean: true })}
            disabled={!state.ready}
          />
        </div>
        <div>
          <label htmlFor="auto">Auto</label>
          <input
            type="checkbox"
            name="auto"
            id="auto"
            checked={state.auto}
            onChange={(): void => setControledInput({ type: 'auto', isBoolean: true })}
            disabled={!state.ready}
          />
        </div>
      </div>
      <div>
        <label htmlFor="from">From</label>
        <input
          type="number"
          name="from"
          id="from"
          step={1}
          disabled={!state.ready}
          onBlur={(): void => setNumberInput({ type: 'from', min: 0, max: state.to })}
          onKeyDown={enterNumberInput}
          onFocus={selectOnFocus}
        />
      </div>
      <div>
        <label htmlFor="to">To</label>
        <input
          type="number"
          name="to"
          id="to"
          step={1}
          disabled={!state.ready}
          onBlur={(): void => setNumberInput({ type: 'to', min: state.from, max: 180 })}
          onKeyDown={enterNumberInput}
          onFocus={selectOnFocus}
        />
      </div>
      <fieldset className="border" disabled={!(state.ready && state.auto)}>
        <legend>Auto</legend>
        <div>
          <label htmlFor="delta">Speed</label>
          <input
            type="range"
            name="delta"
            id="delta"
            min={state.delta_0}
            max={state.delta_1}
            step={0.5}
            value={state.delta}
            onInput={(): void => setControledInput({ type: 'delta', isFloat: true })}
          />
        </div>
      </fieldset>

      <fieldset className="border" disabled={!(state.ready && !state.auto)}>
        <legend>Manual</legend>
        <div>
          <label htmlFor="manualAngle">Angle</label>
          <input
            type="range"
            name="manualAngle"
            id="manualAngle"
            min={state.from}
            max={state.to}
            step={1}
            value={state.manualAngle}
            onInput={(): void => setControledInput({ type: 'manualAngle', isFloat: true })}
          />
          <input
            type="number"
            name="manual_number"
            onBlur={(): void =>
              setNumberInput({
                type: 'manualAngle',
                min: state.from,
                max: state.to,
                name: 'manual_number',
                isFloat: true
              })
            }
            onKeyDown={enterNumberInput}
            onFocus={selectOnFocus}
          />
        </div>
      </fieldset>

      <fieldset className="border" disabled={!state.ready}>
        <legend>Distance</legend>
        <div>
          <label htmlFor="maxDistance">Max Distance</label>
          <input
            type="range"
            name="maxDistance"
            id="maxDistance"
            min={0}
            max={255}
            step={1}
            value={state.maxDistance}
            onInput={(): void => setControledInput({ type: 'maxDistance' })}
          />
          <input
            type="number"
            name="distance_number"
            onBlur={(): void =>
              setNumberInput({ type: 'maxDistance', min: 0, max: 255, name: 'distance_number' })
            }
            onKeyDown={enterNumberInput}
            onFocus={selectOnFocus}
          />
        </div>
      </fieldset>
    </fieldset>
  )
}

export default DataOptions
