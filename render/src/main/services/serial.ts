import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron'
import { SerialPort } from 'serialport'

export function serialServices(mainWindow: BrowserWindow): void {
  let port: SerialPort

  ipcMain.handle('serial:getPorts', getSerialPorts)
  ipcMain.on('serial:open', openPort)
  ipcMain.on('serial:start', serialStart)
  ipcMain.on('serial:stop', serialStop)

  //----------- Get Serial Ports -------------

  async function getSerialPorts(): Promise<string[]> {
    const pathInfo = await SerialPort.list()
    const pathNames = pathInfo.map((port) => port.path)
    return pathNames
  }

  //------------------------------------------
  //-------------- Open Port -----------------

  function openPort(_: IpcMainInvokeEvent, path: string): void {
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
  //------------- Serial Start ---------------

  function serialStart(): void {
    port.write('1', (error) => {
      if (error) console.log(error)
    })
  }

  //------------------------------------------
  //------------- Serial Stop ----------------

  function serialStop(): void {
    port.write('0', (error) => {
      if (error) console.log(error)
    })
  }

  //------------------------------------------
  //----------- Read Serial Data -------------

  function readSerialData(data: Buffer): void {
    console.log(data.readInt8(2))
  }

  //------------------------------------------
}
