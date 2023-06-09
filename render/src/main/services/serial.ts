import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron'
import { SerialPort } from 'serialport'
import { SendOptions } from './serial_types'

//Same definitions as in Arduino sketch
const definitions = {
  enable: 'E',
  delta: 'D',
  auto: 'A',
  angle: 'G',
  start_0: '$',
  start_1: '#',
  end_0: '&',
  end_1: '%',
  true: '001',
  false: '000'
}

export function serialServices(mainWindow: BrowserWindow): void {
  let port: SerialPort

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
    if (typeof options.payload === 'number') payload = `${clamp(options.payload, 0, 255)}`
    console.log(payload)
    port.write(
      `${definitions.start_0}${definitions.start_1}${directive}${payload}${definitions.end_0}${definitions.end_1}`,
      (error) => {
        if (error) console.log(error)
      }
    )
  }

  //------------------------------------------
  //----------- Read Serial Data -------------

  function readSerialData(data: Buffer): void {
    console.log(data.readInt8(2))
  }

  //------------------------------------------
  //------------- On close -------------------

  mainWindow.on('close', () => {
    if (port == null) return

    const directive = definitions.enable
    const payload = definitions.false
    port.write(
      `${definitions.start_0}${definitions.start_1}${directive}${payload}${definitions.end_0}${definitions.end_1}`,
      (error) => {
        if (error) console.log(error)

        port.close()
      }
    )
  })

  //------------------------------------------
  //------------------------------------------

  function clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value
  }

  //------------------------------------------
}
