import { FocusEvent, KeyboardEvent, useContext, useEffect } from 'react'
import { ChildOptionProps } from '../../Options_types'
import { SettingsContext } from '@renderer/components/settings/Settings_context'
import { ControledInputProps, NumberInputProps } from './Data_types'
import { ReducerActionType } from '@renderer/hooks/useSerial/resourses/reducer_Types'
import './Data.css'

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

    input.blur()
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

  function enterCheckbox(e: KeyboardEvent): void {
    if (e.key !== 'Enter' && e.key !== 'Intro') return

    const input = e.target as HTMLInputElement
    const current = input.checked
    const type = input.name

    dispatch({
      type: type as ReducerActionType,
      payload: !current
    })
  }

  return (
    <fieldset className="border p-2 rounded-md border-gray-600 flex flex-col gap-3">
      <legend className="text-gray-500 px-2">Data</legend>

      <div className="flex flex-row gap-6">
        <div className="flex flex-row gap-1">
          <label htmlFor="enable">Enable</label>
          <input
            type="checkbox"
            name="enable"
            id="enable"
            checked={state.enable}
            onChange={(): void => setControledInput({ type: 'enable', isBoolean: true })}
            disabled={!state.ready}
            className="focus:outline focus:outline-1 focus:outline-offset-1"
            onKeyDown={enterCheckbox}
          />
        </div>
        <div className="flex flex-row gap-1">
          <label htmlFor="auto">Auto</label>
          <input
            type="checkbox"
            name="auto"
            id="auto"
            checked={state.auto}
            onChange={(): void => setControledInput({ type: 'auto', isBoolean: true })}
            disabled={!state.ready}
            className="focus:outline focus:outline-1 focus:outline-offset-1"
            onKeyDown={enterCheckbox}
          />
        </div>
      </div>

      <div className="degreTable">
        <label className="justify-self-end" htmlFor="from">
          From:
        </label>
        <input
          type="number"
          name="from"
          id="from"
          step={1}
          disabled={!state.ready}
          onBlur={(): void => setNumberInput({ type: 'from', min: 0, max: state.to })}
          onKeyDown={enterNumberInput}
          onFocus={selectOnFocus}
          className="border border-transparent rounded-md bg-[#333842] text-gray-200 pl-2 hover:border-gray-400 disabled:border-none disabled:bg-[#59595b]"
        />
        <p>deg</p>
        <label className="justify-self-end" htmlFor="to">
          To:
        </label>
        <input
          type="number"
          name="to"
          id="to"
          step={1}
          disabled={!state.ready}
          onBlur={(): void => setNumberInput({ type: 'to', min: state.from, max: 180 })}
          onKeyDown={enterNumberInput}
          onFocus={selectOnFocus}
          className="border border-transparent rounded-md bg-[#333842] text-gray-200 pl-2 hover:border-gray-400 disabled:border-none disabled:bg-[#59595b]"
        />
        <p>deg</p>
      </div>

      <fieldset
        className="border p-2 rounded-md border-gray-600"
        disabled={!(state.ready && state.auto)}
      >
        <legend className="text-gray-500 px-2">Auto</legend>
        <div className="flex flex-row gap-1">
          <label htmlFor="delta">Speed:</label>
          <input
            type="range"
            name="delta"
            id="delta"
            min={state.delta_0}
            max={state.delta_1}
            step={0.5}
            value={state.delta}
            onInput={(): void => setControledInput({ type: 'delta', isFloat: true })}
            className="focus:outline focus:outline-1 rounded-md"
          />
        </div>
      </fieldset>

      <fieldset
        className="border p-2 rounded-md border-gray-600"
        disabled={!(state.ready && !state.auto)}
      >
        <legend className="text-gray-500 px-2">Manual</legend>
        <div className="flex flex-row gap-1">
          <label htmlFor="manualAngle">Angle:</label>
          <input
            type="range"
            name="manualAngle"
            id="manualAngle"
            min={state.from}
            max={state.to}
            step={1}
            value={state.manualAngle}
            onInput={(): void => setControledInput({ type: 'manualAngle', isFloat: true })}
            className="focus:outline focus:outline-1 rounded-md"
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
            className="w-[80px] border border-transparent rounded-md bg-[#333842] text-gray-200 pl-2 hover:border-gray-400 disabled:border-none disabled:bg-[#59595b]"
          />
        </div>
      </fieldset>

      <fieldset className="border p-2 rounded-md border-gray-600" disabled={!state.ready}>
        <legend className="text-gray-500 px-2">Distance</legend>
        <div className="flex flex-row gap-1">
          <label htmlFor="maxDistance">Max</label>
          <input
            type="range"
            name="maxDistance"
            id="maxDistance"
            min={0}
            max={255}
            step={1}
            value={state.maxDistance}
            onInput={(): void => setControledInput({ type: 'maxDistance' })}
            className="focus:outline focus:outline-1 rounded-md"
          />
          <input
            type="number"
            name="distance_number"
            onBlur={(): void =>
              setNumberInput({ type: 'maxDistance', min: 0, max: 255, name: 'distance_number' })
            }
            onKeyDown={enterNumberInput}
            onFocus={selectOnFocus}
            className="w-[70px] border border-transparent rounded-md bg-[#333842] text-gray-200 pl-2 hover:border-gray-400 disabled:border-none disabled:bg-[#59595b]"
          />
          <p>cm</p>
        </div>
      </fieldset>
    </fieldset>
  )
}

export default DataOptions
