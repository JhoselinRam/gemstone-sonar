/* eslint-disable react/display-name */
import { forwardRef, memo, useImperativeHandle, useRef } from 'react'
import { graph2D, linspace } from 'scigrapher'
import { GraphProps, GraphReference } from './Graph_types'
import { floatMap } from '@renderer/hooks/useSerial/resourses/reducer'
import { Graph2D } from 'scigrapher/lib/es5/Graph2D/Graph2D_Types'

const datapoints = 400

const Graph = forwardRef<GraphReference, GraphProps>((props, ref) => {
  const observer = useRef<ResizeObserver>(new ResizeObserver(onResize))
  const divElement = useRef<HTMLDivElement | null>(null)
  const graphData = useRef<number[]>(linspace(0, 0, datapoints))
  const xData = linspace(0, datapoints, datapoints)
  const counter = useRef(0)
  const graph = useRef<Graph2D | null>(null)

  useImperativeHandle(ref, () => {
    return { newDistance }
  })

  function newDistance(distance: number): void {
    if (graph.current == null) return
    const usableDistance = distance === 255 ? 0 : floatMap(distance, 0, 255, 0, props.maxDistance)

    if (counter.current > datapoints - 1) counter.current = 0

    graphData.current[counter.current] = usableDistance
    counter.current++

    graph.current.getDatasets().linechart[0].dataY(graphData.current)
    graph.current.draw()
  }

  function graphOpacity(x: number): number {
    const relativeDistance = 1 - floatMap(counter.current, 0, datapoints - 1, 0, 1)

    if (x <= counter.current) return floatMap(x, 0, counter.current, relativeDistance, 1)

    return floatMap(x, counter.current, datapoints, 0, relativeDistance)
  }

  function renderGraph(container: HTMLDivElement): void {
    if (container == null) return
    container.replaceChildren()

    divElement.current = container

    const dpi = window.devicePixelRatio
    const width = container.parentElement!.clientWidth * dpi
    const height = container.parentElement!.clientHeight * dpi

    graph.current = graph2D(container)
      .containerSize({ width, height })
      .containerResize({ preserveAspectRatio: false })
      .backgroundColor('#242c40')
      .axisDomain({ x: { start: 0, end: datapoints }, y: { start: 0, end: props.maxDistance } })
      .axisText({ x: { opacity: 0 }, y: { opacity: 0 } })
      .axisOverlap({ x: false, y: false })
      .axisTicks({ x: { opacity: 0 }, y: { opacity: 0 } })
      .axisOpacity({ axis: 0.1 })
      .gridStyle({ primary: 'dot' })
      .gridOpacity({ grid: 0.1 })
      .gridColor({ grid: '#ffffff' })

    graph.current
      .addDataset('linechart')
      .dataX(xData)
      .dataY(graphData.current)
      .lineColor('#c1ff80')
      .lineOpacity(graphOpacity)

    graph.current.draw()
  }

  function onResize(entries: ResizeObserverEntry[]): void {
    if (divElement.current == null) return

    entries.forEach((entrie) => {
      const rect = entrie.contentRect
      const dpi = window.devicePixelRatio
      divElement.current!.style.width = `${rect.width * dpi}px`
      divElement.current!.style.height = `${rect.height * dpi}px`
    })
  }

  function setObsever(element: HTMLDivElement): void {
    if (element == null) return

    observer.current.disconnect()
    observer.current.observe(element)
  }

  return (
    <div className="w-full h-20 overflow-hidden" ref={setObsever}>
      <div className="graph" ref={renderGraph}></div>
    </div>
  )
})

export default memo(Graph)
