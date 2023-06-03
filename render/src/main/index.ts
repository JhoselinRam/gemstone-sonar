import { app, shell, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { SerialPort } from 'serialport'

//----------- Create Window ----------------

let port: SerialPort
let mainWindow: BrowserWindow

// Create the browser window.
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

//------------------------------------------
//------------- When Ready -----------------

app.whenReady().then(() => {
  ipcMain.handle('serial:getPorts', getSerialPorts)
  ipcMain.on('serial:open', openPort)
  ipcMain.on('serial:start', serialStart)

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

//------------------------------------------
//--------------- On Close -----------------

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//------------------------------------------
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
    mainWindow.webContents.send('serial:status', 'ok')
  })
}

//------------------------------------------
//------------------------------------------

function serialStart(): void {
  port.write('start', (error) => {
    if (error) console.log(error)
  })
}

//------------------------------------------
