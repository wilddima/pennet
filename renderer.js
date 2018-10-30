const { remote, ipcRenderer } = require('electron');

const mainProcess = remote.require('./index.js');

dataView = document.querySelector('#netstats');

ipcRenderer.on('update-data', (event, data) => {
  str = ''
  Object.keys(data).forEach((key) => {
    str = `${str}
    <strong>
      ${data[key].Name}
    </strong>
    <p>
      ${data[key].BytesIn}|${data[key].BytesOut}
    </p>
    `
  })
  console.log(str)
  dataView.innerHTML = str;
});
