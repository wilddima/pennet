const { remote, ipcRenderer } = require('electron');
const { mapValues, sortBy, reverse } = require('lodash');

const mainProcess = remote.require('./index.js');

const mbPrecision = 2
const pidRegexp = /\.[0-9]{1,}$/

dataView = document.querySelector('#stats-table');

ipcRenderer.on('update-data', (event, data) => {
  str = `
    <span>${Date()}</span>
    <table class="uk-table">
      <caption></caption>
      <thead>
          <tr>
            <th><abbr title="Pid">Pid</abbr></th>
            <th><abbr title="Process">Process</abbr></th>
            <th><abbr title="In">In</abbr></th>
            <th><abbr title="Out">Out</abbr></th>
          </tr>
      </thead>
      <tbody>
    `

  data = mapValues(data, (d) => {
    bo = parseInt(d.BytesOut)
    bi = parseInt(d.BytesIn)
    pid = d.Name.match(pidRegexp)
    if (pid) {
      pid = pid[0].replace("\.", "")
    }
    name = d.Name.replace(pidRegexp, "")
    return {Name: name,
            BytesOut: bo,
            BytesIn: bi,
            Pid: pid,
            MbOut: bo/1024/1024,
            MbIn: bi/1024/1024,
    }
  })

  data = reverse(sortBy(data, (d) => d.BytesOut + d.BytesIn))

  data.forEach((d) => {
    str = `${str}
     <tr>
       <td>${d.Pid}</td>
       <td>${d.Name}</td>
       <td>${d.MbIn.toFixed(mbPrecision)} mb</td>
       <td>${d.MbOut.toFixed(mbPrecision)} mb</td>
     </tr>
    `
  })

  str = `${str}</tbody></table>`
  dataView.innerHTML = str;
});
