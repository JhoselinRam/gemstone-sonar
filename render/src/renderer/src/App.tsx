import { useEffect, useRef } from 'react'
import Graph from './components/graph/Graph'
import { GraphReference } from './components/graph/Graph_types'
import Interface from './components/interface/Interface'
import Settings from './components/settings/Settings'
import useSerial from './hooks/useSerial/useSerial'

function App(): JSX.Element {
  const [data, state, dispatch] = useSerial()
  const graphRef = useRef<GraphReference | null>(null)

  useEffect(() => {
    if (graphRef.current == null) return

    graphRef.current.newDistance(data.distance)
  }, [data])

  return (
    <div className="p-1 h-screen max-h-screen bg-slate-700 flex flex-col overflow-scroll">
      <Settings state={state} dispatch={dispatch} />
      <div className="flex-grow flex flex-col gap-6 p-3">
        <Interface
          distance={data.distance}
          angle={data.angle}
          from={state.from}
          to={state.to}
          maxDistance={state.maxDistance}
        />
        <Graph maxDistance={state.maxDistance} ref={graphRef} />
      </div>
    </div>
  )
}

export default App
