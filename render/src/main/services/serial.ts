import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron'
import { SerialPort } from 'serialport'
import { InitialState, SendOptions } from './serial_types'

//Same definitions as in Arduino sketch
const definitions = {
  enable: 'E',
  delta: 'D',
  delta_0: '0',
  delta_1: '1',
  auto: 'A',
  angle: 'G',
  from: 'F',
  to: 'T',
  max_distance: 'C',
  data: 'Z',
  start_0: 0,
  start_1: 1,
  directive: 2,
  distance: 3,
  position: 4,
  end_0: 5,
  end_1: 6,
  sync_start_0: '$',
  sync_start_1: '#',
  sync_end_0: '&',
  sync_end_1: '%',
  buffer_size: 7,
  true: '001',
  false: '000'
}

export function serialServices(mainWindow: BrowserWindow): void {
  let port: SerialPort
  let stateCounter = 0
  const initialState: Partial<InitialState> = {}

  ipcMain.handle('serial:getPorts', getSerialPorts)
  ipcMain.on('serial:open', openPort)
  ipcMain.on('serial:send', serialSend)

  //----------- Get Serial Ports -------------

  async function getSerialPorts(): Promise<string[]> {
    const pathInfo = await SerialPort.list()
    const pathNames = pathInfo.map((port) => port.path)
    return pathNames
  }

  //------------------------------------------
  //-------------- Open Port -----------------

  function openPort(_: IpcMainInvokeEvent, path: string): void {
    if (port != null) port.close()

    port = new SerialPort({ path, baudRate: 115200 }, (error) => {
      if (error) {
        mainWindow.webContents.send('serial:status', 'error')
        return
      }
      port.on('data', readSerialData)
      mainWindow.webContents.send('serial:status', 'ok')
    })
  }

  //------------------------------------------
  //------------- Serial Send ----------------

  function serialSend(_: Electron.IpcMainEvent, options: SendOptions): void {
    let payload = ''
    const directive = definitions[options.directive]

    if (typeof options.payload === 'boolean')
      payload = options.payload ? definitions.true : definitions.false
    if (typeof options.payload === 'number') {
      payload = `${clamp(options.payload, 0, 255)}`
      payload =
        payload.length === 1 ? `00${payload}` : payload.length === 2 ? `0${payload}` : payload
    }

    port.write(
      `${definitions.sync_start_0}${definitions.sync_start_1}${directive}${payload}${definitions.sync_end_0}${definitions.sync_end_1}`,
      (error) => {
        if (error) console.log(error)
      }
    )
  }

  //------------------------------------------
  //----------- Read Serial Data -------------

  function readSerialData(data: Buffer): void {
    if (!isInSync(data)) {
      port.flush((error) => {
        if (error) console.log(error)
      })

      return
    }

    switch (data.readUInt8(definitions.directive)) {
      //Send the data to the renderer
      case definitions.data.charCodeAt(0):
        mainWindow.webContents.send('serial:data', {
          angle: data.readUint8(definitions.position),
          distance: data.readUint8(definitions.distance)
        })
        return

      //This cases are only relevant when the port initialize
      case definitions.from.charCodeAt(0):
        initialState.from = data.readUint8(definitions.distance)
        stateCounter++
        break

      case definitions.to.charCodeAt(0):
        initialState.to = data.readUint8(definitions.distance)
        stateCounter++
        break

      case definitions.delta_0.charCodeAt(0):
        initialState.delta_0 = data.readUint8(definitions.distance)
        stateCounter++
        break

      case definitions.delta_1.charCodeAt(0):
        initialState.delta_1 = data.readUint8(definitions.distance)
        stateCounter++
        break

      case definitions.enable.charCodeAt(0):
        initialState.enable = data.readUint8(definitions.distance) === 1 ? true : false
        stateCounter++
        break

      case definitions.auto.charCodeAt(0):
        initialState.auto = data.readUint8(definitions.distance) === 1 ? true : false
        stateCounter++
        break

      case definitions.delta.charCodeAt(0):
        initialState.delta = floatMap(
          data.readUint8(definitions.distance),
          0,
          255,
          initialState.delta_0!,
          initialState.delta_1!
        )
        stateCounter++
        break

      case definitions.angle.charCodeAt(0):
        initialState.angle = floatMap(
          data.readUint8(definitions.distance),
          0,
          255,
          initialState.from!,
          initialState.to!
        )
        stateCounter++
        break

      case definitions.max_distance.charCodeAt(0):
        initialState.distance = data.readUint8(definitions.distance)
        stateCounter++
        break
    }

    //This will set the 'ready' state
    if (stateCounter === 9) mainWindow.webContents.send('serial:init', initialState)
  }

  //------------------------------------------
  //------------------------------------------

  function isInSync(data: Buffer): boolean {
    if (
      data.readUint8(definitions.start_0) !== definitions.sync_start_0.charCodeAt(0) ||
      data.readUint8(definitions.start_1) !== definitions.sync_start_1.charCodeAt(0) ||
      data.readUint8(definitions.end_0) !== definitions.sync_end_0.charCodeAt(0) ||
      data.readUint8(definitions.end_1) !== definitions.sync_end_1.charCodeAt(0) ||
      data.length !== definitions.buffer_size
    )
      return false

    return true
  }

  //------------------------------------------
  //------------- On close -------------------

  mainWindow.on('close', () => {
    if (port == null) return
    const payload = definitions.false

    let directive = definitions.auto
    port.write(
      `${definitions.sync_start_0}${definitions.sync_start_1}${directive}${payload}${definitions.sync_end_0}${definitions.sync_end_1}`,
      (error) => {
        if (error) console.log(error)
      }
    )

    directive = definitions.enable
    port.write(
      `${definitions.sync_start_0}${definitions.sync_start_1}${directive}${payload}${definitions.sync_end_0}${definitions.sync_end_1}`,
      (error) => {
        if (error) console.log(error)
      }
    )

    port.close()
  })

  //------------------------------------------
  //------------------------------------------

  function clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value
  }

  //------------------------------------------
  //-------------------------------------------

  function floatMap(
    value: number,
    from_0: number,
    from_1: number,
    to_0: number,
    to_1: number
  ): number {
    const m = (to_1 - to_0) / (from_1 - from_0)
    const b = (to_0 * from_1 - to_1 * from_0) / (from_1 - from_0)

    return m * value + b
  }
}
