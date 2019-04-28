const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater")
const log = require('electron-log')

let win
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";


const dispatch = (data) => {
  win.webContents.send('message', data)
}

const createDefaultWindow = () => {
  win = new BrowserWindow()

  win.on('closed', () => {
    win = null
  })

  win.loadFile('src/gui/index.html')

  return win
}

app.on('ready', () => {
  
  createDefaultWindow()

  autoUpdater.checkForUpdatesAndNotify()

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('version', app.getVersion())
  })

})

app.on('window-all-closed', () => {
  app.quit()
})


autoUpdater.on('checking-for-update', () => {
  log.info("check")
  dispatch('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  log.info("available")
  dispatch('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  log.info("not-available")
  dispatch('Update not available.')
})

autoUpdater.on('error', (err) => {
  log.error("error")
  dispatch('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  log.info("progress")
  // let log_message = "Download speed: " + progressObj.bytesPerSecond
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  // dispatch(log_message)

    win.webContents.send('download-progress', progressObj.percent)

})

autoUpdater.on('update-downloaded', (info) => {
  log.info("dowloaded")
  setTimeout(function() {
    autoUpdater.quitAndInstall();
  }, 5000);
  dispatch('Update downloaded')
})
