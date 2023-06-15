import useSerial from './hooks/useSerial/useSerial'
import Settings from './components/settings/settings'

function App(): JSX.Element {
  const [data, state, dispatch] = useSerial()

  return (
    <div className="p-1 h-[100vh] bg-slate-700">
      <Settings state={state} dispatch={dispatch}></Settings>
    </div>
  )
}

export default App
