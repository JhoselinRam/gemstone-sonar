import Graph from './components/graph/Graph'
import Interface from './components/interface/Interface'
import Settings from './components/settings/Settings'
import useSerial from './hooks/useSerial/useSerial'

function App(): JSX.Element {
  const [data, state, dispatch] = useSerial()

  return (
    <div className="p-1 h-screen bg-slate-700">
      <Settings state={state} dispatch={dispatch} />
      <div className="flex flex-col items-stretch">
        <Interface />
        <Graph />
      </div>
    </div>
  )
}

export default App
