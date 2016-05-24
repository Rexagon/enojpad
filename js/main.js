const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog;

let mainWindow

var template = [
  {
    label: 'File'
  },
  {
    label: 'Edit'
  },
  {
    label: 'View'
  },
  {
    label: 'Language'
  },
  {
    label: 'Window'
  }
];

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(`file://${__dirname}/../index.html`)

  const menu = electron.Menu.buildFromTemplate(template);
  electron.Menu.setApplicationMenu(menu);

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
