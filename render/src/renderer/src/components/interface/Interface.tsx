import { useEffect } from 'react'
import { InterfaceProps } from './Interface_types'

const margin = 10

function Interface({ angle, distance, from, maxDistance, to }: InterfaceProps): JSX.Element {
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
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    arch(context, canvas)
  }

  function arch(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const x = canvas.clientWidth / 2
    const y = canvas.clientHeight + margin
    const radius = canvas.clientHeight - 2 * margin
    const angleStart = from - Math.PI
    const angleEnd = to - Math.PI
  }

  function getContext(element: HTMLCanvasElement): void {
    if (element == null) return
    const context = element.getContext('2d')!
    const dpi = window.devicePixelRatio

    setAspectRatio(element.parentElement! as HTMLDivElement)

    context.scale(dpi, dpi)

    draw(context, element)
  }

  function onResize(entries: ResizeObserverEntry[]): void {
    entries.forEach((entrie) => setAspectRatio(entrie.target as HTMLDivElement))
  }

  function setAspectRatio(container: HTMLDivElement): void {
    const canvas = container.getElementsByTagName('canvas')[0]
    const containerRatio = (container.clientWidth - margin) / (container.clientHeight - margin)

    if (containerRatio > ratio) {
      canvas.style.width = 'auto'
      canvas.style.height = '100%'
    } else {
      canvas.style.height = 'auto'
      canvas.style.width = '100%'
    }
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
        className="border border-red-700 w-full max-h-full"
        ref={getContext}
        style={{ aspectRatio: ratio }}
      ></canvas>
    </div>
  )
}

export default Interface
