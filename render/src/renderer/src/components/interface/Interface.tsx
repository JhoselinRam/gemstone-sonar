import { useEffect, useRef } from 'react'
import { Datapoint, InterfaceProps } from './Interface_types'
import { floatMap } from '@renderer/hooks/useSerial/resourses/reducer'

function Interface({ angle, distance, from, maxDistance, to }: InterfaceProps): JSX.Element {
  const context = useRef<CanvasRenderingContext2D | null>(null)
  let observer: ResizeObserver
  const shadow = useRef<number[]>([])
  const data = useRef<Datapoint[]>([])
  const ratio =
    Math.abs(Math.cos((from * Math.PI) / 180)) + Math.abs(Math.cos((to * Math.PI) / 180))
  const margin = 10
  const green = '#4e8c0e'
  const maxShadow = 35
  const maxData = 60
  const minDataSize = 2
  const maxDataSize = 5

  useEffect(() => {
    //Add the new angle to the shadow array
    shadow.current.push(angle)
    if (shadow.current.length > maxShadow) shadow.current = shadow.current.slice(1)

    //Add the new distance to the data array
    data.current.push({
      distance,
      angle,
      size: minDataSize + (maxDataSize - minDataSize) * Math.random()
    })
    if (data.current.length > maxData) data.current = data.current.slice(1)

    return () => {
      if (observer == null) return
      observer.disconnect()
    }
  })

  function draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    if (from === to) return

    const offset = 3 * margin
    const x = canvas.clientWidth / 2
    const y = canvas.clientHeight - offset
    const radius = canvas.clientHeight - 2 * offset
    const angleStart = ((from - 180) * Math.PI) / 180
    const angleEnd = ((to - 180) * Math.PI) / 180
    const archStartX = radius * Math.cos(angleStart)
    const archEndX = radius * Math.cos(angleEnd)
    const archStartY = radius * Math.sin(angleStart)
    const archEndY = radius * Math.sin(angleEnd)

    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
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
    context.textBaseline = 'top'
    context.textAlign = 'end'
    context.fillStyle = green
    context.setLineDash([1, 3])
    for (let i = 0; i <= segments; i++) {
      //Line
      context.globalAlpha = 0.4
      context.beginPath()
      context.arc(0, 0, radialDelta * i, angleStart, angleEnd)
      context.stroke()

      //Text
      const text = (((i * radialDelta) / radius) * maxDistance).toFixed(1)
      const textX = i * radialDelta * Math.cos(angleStart) - margin
      const textY = i * radialDelta * Math.sin(angleStart) + margin
      context.globalAlpha = 1
      context.fillText(text, textX, textY)
    }

    //Angle grid
    const angleDelta = (10 * Math.PI) / 180
    const initialAngle = (Math.floor((angleStart * 180) / Math.PI / 10) + 1) * 10
    let activeAngle = (initialAngle * Math.PI) / 180
    context.setLineDash([1, 3])
    context.textAlign = 'center'
    while (activeAngle < angleEnd) {
      const gridX = radius * Math.cos(activeAngle)
      const gridY = radius * Math.sin(activeAngle)

      //Line
      context.globalAlpha = 0.3
      context.beginPath()
      context.moveTo(0, 0)
      context.lineTo(gridX, gridY)
      context.stroke()

      //Text
      const textX = (radius + 2 * margin) * Math.cos(activeAngle)
      const textY = (radius + 2 * margin) * Math.sin(activeAngle)
      const degAngle = (activeAngle * 180) / Math.PI + 180
      const text = `${degAngle.toFixed(0)}°`
      context.globalAlpha = 1
      context.fillText(text, textX, textY)

      activeAngle += angleDelta
    }

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

    //Indicator shadow
    const shadowLenght = shadow.current.length
    const maxShadowOpacity = 0.3
    context.shadowBlur = 0
    for (let i = 0; i < shadowLenght - 1; i++) {
      const shadowOpacity = (maxShadowOpacity * i) / (shadowLenght - 1)
      const shadowStart = ((shadow.current[i] - 180) * Math.PI) / 180
      const shadowEnd = ((shadow.current[i + 1] - 180) * Math.PI) / 180
      const startX = Math.round(radius * Math.cos(shadowStart))
      const startY = Math.round(radius * Math.sin(shadowStart))
      const endX = Math.round(radius * Math.cos(shadowEnd))
      const endY = Math.round(radius * Math.sin(shadowEnd))

      context.fillStyle = green
      context.globalAlpha = shadowOpacity
      context.beginPath()
      context.arc(0, 0, radius, shadowStart, shadowEnd, shadowEnd < shadowStart)
      context.moveTo(startX, startY)
      context.lineTo(0, 0)
      context.lineTo(endX, endY)
      context.fill()
    }

    //Data
    const maxDataOpacity = 0.7
    const replicas = 15
    context.fillStyle = green //'#edf7e4'
    context.shadowBlur = 0
    data.current.forEach((point, index) => {
      if (point.distance === 255) return
      const pointRadius = floatMap(point.distance, 0, 255, 0, radius)
      const pointAngle = ((point.angle - 180) * Math.PI) / 180
      const pointX = pointRadius * Math.cos(pointAngle)
      const pointY = pointRadius * Math.sin(pointAngle)
      const pointOpacity = (maxDataOpacity * index) / (maxData - 1)

      for (let i = 0; i < replicas; i++) {
        context.globalAlpha = pointOpacity / replicas
        context.beginPath()
        context.arc(pointX, pointY, floatMap(i, 0, replicas - 1, point.size * 3, 1), 0, 2 * Math.PI)
        context.fill()
      }

      //context.globalAlpha = pointOpacity
      //context.beginPath()
      //context.arc(pointX, pointY, point.size, 0, 2 * Math.PI)
      //context.fill()
    })

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
