import { graph2D } from 'scigrapher'

function Graph(): JSX.Element {
  function renderGraph(element: HTMLDivElement): void {
    if (element == null) return

    element.replaceChildren()
    const width = element.parentElement!.clientWidth
    const height = element.parentElement!.clientHeight
    console.log(width, height)

    graph2D(element).containerSize({ width, height }).containerResize().pointerMove().draw()
  }

  return (
    <div className="w-full h-36 p-0 m-0 border border-red-700">
      <div className="border border-red-700" ref={renderGraph}></div>
    </div>
  )
}

export default Graph
