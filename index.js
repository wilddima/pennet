const { createConnection } = require('net');
const { spawn } = require('child_process');
const subprocess = spawn(process.cwd() + '/pennet');

let stats = {}

subprocess.on('error', (err) => {
  console.log(err);
});

const client = createConnection({ port: 12345 }, () => {
  console.log('connected to server!');
  client.write('world!\r\n');
});

client.on('error', (err) => console.log(err))

client.on('end', () => {
  console.log('disconnected from server');
});

const { app, BrowserWindow, Tray, ipcRenderer } = require('electron');
const Positioner = require('electron-positioner');

let tray = null
let win = null

app.dock.hide()

app.on('ready', () => {
  tray = new Tray(process.cwd() + '/assets/icon.png')

  let win = new BrowserWindow({
    alwaysOnTop: true,
    show: false,
    frame: false,
    skipTaskbar: true,
    width: 500,
    height: 800
  })

  positioner = new Positioner(win)
  positioner.move('topRight')

  win.setMenu(null)
  win.toggleDevTools();
  win.loadFile(process.cwd() + '/index.html')

  tray.setIgnoreDoubleClickEvents(true)

  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  })

  client.on('data', (data) => {
    try {
      stats = Object.assign(stats, JSON.parse(data));
      win.webContents.send('update-data', stats);
    } catch {}
  })
})
