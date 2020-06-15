'use strict';

const {app, BrowserWindow} = require('electron')
const path = require('path')

require('update-electron-app')({
  repo: 'https://github.com/sumrak10/SmrkMusic',
  updateInterval: '1 hour',
  logger: require('electron-log')
})

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd')
})

let mainWindow
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    // resizable: false,
    frame: false,
    icon: 'icon.ico',
    // transparent: true,
    // backgroundColor: '#000000',
    webPreferences: {
      // nodeIntegration: true,
      nativeWindowOpen: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true
    }
  })
  // показать окно после полной загрузки
  mainWindow.once('ready-to-show', () => {
    mainWindow.show() 
  })
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools()
}
app.whenReady().then(() => {
  createWindow()
  // powerMonitor.on('on-ac', () => {
  //   console.log('The system is going to sleep')
  // })
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})