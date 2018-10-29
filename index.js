const { createConnection } = require('net');
const { spawn } = require('child_process');
const { app, BrowserWindow, Tray, ipcRenderer } = require('electron');
const Positioner = require('electron-positioner');

const subprocess = spawn('./pennet');

let stats = {}

subprocess.on('error', (err) => {
  console.log(err);
});

const client = createConnection({ port: 12345 }, () => {
  console.log('connected to server!');
  client.write('world!\r\n');
});

client.on('data', (data) => {
  stats = Object.assign(stats, JSON.parse(data));
})

client.on('error', (err) => console.log(err))

client.on('end', () => {
  console.log('disconnected from server');
});

let tray = null
let win = null

app.dock.hide()

app.on('ready', () => {
  tray = new Tray(process.cwd() + '/assets/icon.png')

  let win = new BrowserWindow({
    alwaysOnTop: true,
    show: false,
    frame: false,
    skipTaskbar: true
  })

  positioner = new Positioner(win)
  positioner.move('topRight')

  win.setMenu(null)
  win.loadFile(process.cwd() + '/index.html')

  tray.setIgnoreDoubleClickEvents(true)

  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  })
})
