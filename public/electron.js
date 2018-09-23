const {app, BrowserWindow} = require('electron');

const path = require('path');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const notifier = require('node-notifier');

let mainWindow;

const autoUpdater = require('electron-updater').autoUpdater;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function createWindow() {
  mainWindow = new BrowserWindow({width: 1300, height: 860});
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  mainWindow.on('closed', () => (mainWindow = null));
  initAutoUpdate();

  // Open the DevTools.
  if (isDev) mainWindow.webContents.openDevTools();
}

function initAutoUpdate() {
  if (isDev) {
    return;
  }

  autoUpdater.checkForUpdates();
  autoUpdater.signals.updateDownloaded(showUpdateNotification);
}

function showUpdateNotification(it) {
  it = it || {};
  const restartNowAction = 'Restart now';

  const versionLabel = it.label ? `Version ${it.version}` : 'The latest version';

  notifier.notify(
    {
      title: 'A new update is ready to install.',
      message: `${versionLabel} has been downloaded and will be automatically installed after restart.`,
      closeLabel: 'Okay',
      actions: restartNowAction
    },
    function(err, response, metadata) {
      if (err) throw err;
      if (metadata.activationValue !== restartNowAction) {
        return;
      }
      autoUpdater.quitAndInstall();
    }
  );
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});