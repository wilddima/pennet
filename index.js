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

let tray = null;
let win = null;
let accBuffer = Buffer.from([]);

app.dock.hide()

app.on('ready', () => {
  tray = new Tray(process.cwd() + '/assets/icon.png')

  let win = new BrowserWindow({
    alwaysOnTop: true,
    show: false,
    frame: false,
    skipTaskbar: true,
    width: 400,
    height: 400
  })

  win.setMenu(null);
  win.toggleDevTools();
  win.loadFile(process.cwd() + '/index.html')

  tray.setIgnoreDoubleClickEvents(true)

  tray.on('click', (e) => {
    position = tray.getBounds();
    win.setPosition(position.x - 200, position.y + 30);
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  })

  win.on('blur', () => {
    if (win.isVisible()) {
      win.hide();
    }
  })

  client.on('data', (data) => {
    data = Buffer.concat([accBuffer, data])
    buff = data.toString().split("\n")
    buff.forEach((b) => {
      if (b.length !== 0) {
        try {
          stats = Object.assign(stats, JSON.parse(b));
          win.webContents.send('update-data', stats);
          accBuffer = Buffer.from([]);
        } catch (e) {
          accBuffer = data;
        }
      }
    })
  })
})
