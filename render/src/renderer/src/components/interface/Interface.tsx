import { useEffect, useRef } from 'react'
import { InterfaceProps } from './Interface_types'

const margin = 10
const green = '#4e8c0e'

function Interface({ angle, distance, from, maxDistance, to }: InterfaceProps): JSX.Element {
  const context = useRef<CanvasRenderingContext2D | null>(null)
  let observer: ResizeObserver
  const ratio =
    Math.abs(Math.cos((from * Math.PI) / 180)) + Math.abs(Math.cos((to * Math.PI) / 180))

  useEffect(() => {
    return () => {
      if (observer == null) return
      observer.disconnect()
    }
  })

  function draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    if (from === to) return

    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    arch(context, canvas)
  }

  function arch(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const offset = 2 * margin
    const x = canvas.clientWidth / 2
    const y = canvas.clientHeight - offset
    const radius = canvas.clientHeight - 2 * offset
    const angleStart = ((from - 180) * Math.PI) / 180
    const angleEnd = ((to - 180) * Math.PI) / 180
    const archStartX = radius * Math.cos(angleStart)
    const archEndX = radius * Math.cos(angleEnd)
    const archStartY = radius * Math.sin(angleStart)
    const archEndY = radius * Math.sin(angleEnd)

    context.save()
    context.translate(x, y)
    context.strokeStyle = green

    //Background
    context.fillStyle = 'black'
    context.globalAlpha = 0.2
    context.beginPath()
    context.arc(0, 0, radius, angleStart, angleEnd)
    context.moveTo(archStartX, archStartY)
    context.lineTo(0, 0)
    context.lineTo(archEndX, archEndY)
    context.fill()

    //Frame
    context.globalAlpha = 1
    context.beginPath()
    context.arc(0, 0, radius, angleStart, angleEnd)
    context.moveTo(archStartX, archStartY)
    context.lineTo(0, 0)
    context.lineTo(archEndX, archEndY)
    context.stroke()

    //Radial Grid
    const segments = 5
    const radialDelta = radius / segments
    context.globalAlpha = 0.4
    context.setLineDash([1, 3])
    for (let i = 1; i < segments; i++) {
      context.beginPath()
      context.arc(0, 0, radialDelta * i, angleStart, angleEnd)
      context.stroke()
    }

    //Angle grid
    const angleDelta = (10 * Math.PI) / 180
    let activeAngle = angleStart + angleDelta
    context.globalAlpha = 0.3
    context.setLineDash([1, 3])
    context.beginPath()
    while (activeAngle < angleEnd) {
      const gridX = radius * Math.cos(activeAngle)
      const gridY = radius * Math.sin(activeAngle)

      context.moveTo(0, 0)
      context.lineTo(gridX, gridY)

      activeAngle += angleDelta
    }
    context.stroke()

    //Indicator
    const indicatorAngle = ((angle - 180) * Math.PI) / 180
    const indicatorX = radius * Math.cos(indicatorAngle)
    const indicatorY = radius * Math.sin(indicatorAngle)
    context.strokeStyle = '#edf7e4'
    context.globalAlpha = 1
    context.lineWidth = 2
    context.setLineDash([])
    context.shadowBlur = 15
    context.shadowColor = green
    context.shadowOffsetX = 0
    context.shadowOffsetY = 0

    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(indicatorX, indicatorY)
    context.stroke()

    context.restore()
  }

  function getContext(element: HTMLCanvasElement): void {
    if (element == null) return
    context.current = element.getContext('2d')!
    const dpi = window.devicePixelRatio

    setAspectRatio(element.parentElement! as HTMLDivElement)

    context.current.scale(dpi, dpi)

    draw(context.current, element)
  }

  function onResize(entries: ResizeObserverEntry[]): void {
    entries.forEach((entrie) => setAspectRatio(entrie.target as HTMLDivElement))
  }

  function setAspectRatio(container: HTMLDivElement): void {
    const canvas = container.getElementsByTagName('canvas')[0]
    const containerRatio = (container.clientWidth - margin) / (container.clientHeight - margin)

    canvas.style.width = '0'
    canvas.style.height = '0'

    if (containerRatio > ratio) {
      canvas.style.width = 'auto'
      canvas.style.height = '100%'
    } else {
      canvas.style.height = 'auto'
      canvas.style.width = '100%'
    }

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    if (context.current != null) draw(context.current, canvas)
  }

  function setObserver(element: HTMLDivElement): void {
    if (element == null) return

    observer = new ResizeObserver(onResize)
    observer.disconnect()
    observer.observe(element)
  }

  return (
    <div
      className="bg-[#222b3b] w-full max-h-screen flex-grow flex items-center justify-center"
      ref={setObserver}
    >
      <canvas
        className="w-full max-h-full"
        ref={getContext}
        style={{ aspectRatio: ratio }}
      ></canvas>
    </div>
  )
}

export default Interface
