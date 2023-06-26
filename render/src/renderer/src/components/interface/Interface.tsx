import { InterfaceProps } from './Interface_types'

const margin = 10

function Interface({ angle, distance, from, maxDistance, to }: InterfaceProps): JSX.Element {
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

    context.beginPath()
    context.ellipse(x, y, radius, radius, 0, angleStart, angleEnd)
    context.stroke()

    context.beginPath()
    context.ellipse(x, y, 50, 50, 0, 0, 2 * Math.PI)
    context.stroke()
  }

  function getContext(element: HTMLCanvasElement): void {
    if (element == null) return
    const context = element.getContext('2d')!
    const width = element.clientWidth
    const height = element.clientHeight
    const dpi = window.devicePixelRatio

    element.width = width * dpi
    element.height = height * dpi
    element.style.width = `${width}px`
    element.style.height = `${height}px`

    context.scale(dpi, dpi)

    draw(context, element)
  }

  return (
    <div className="bg-[#222b3b] w-full flex-grow">
      <canvas className="w-full h-full" ref={getContext}></canvas>
    </div>
  )
}

export default Interface
