import Settings from './components/settings/Settings'
import useSerial from './hooks/useSerial/useSerial'

function App(): JSX.Element {
  const [data, state, dispatch] = useSerial()

  return (
    <div className="p-1 h-[100vh] bg-slate-700">
      <Settings></Settings>
    </div>
  )
}

export default App
