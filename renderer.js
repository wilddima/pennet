const { remote, ipcRenderer } = require('electron');
const { mapValues, sortBy, reverse } = require('lodash');

const mainProcess = remote.require('./index.js');

dataView = document.querySelector('#stats-table');

ipcRenderer.on('update-data', (event, data) => {
  str = `
    <table class="uk-table">
      <caption></caption>
      <thead>
          <tr>
            <th><abbr title="Process">Process</abbr></th>
            <th><abbr title="In">In</abbr></th>
            <th><abbr title="Out">Out</abbr></th>
          </tr>
      </thead>
      <tfoot>
          <tr>
            <td><abbr title="Process">Process</abbr></td>
            <td><abbr title="In">In</abbr></td>
            <td><abbr title="Out">Out</abbr></td>
          </tr>
      </tfoot>
      <tbody>
    `

  data = mapValues(data, (d) => {
    bo = parseInt(d.BytesOut)
    bi = parseInt(d.BytesIn)
    return {...d,
            BytesOut: bo,
            BytesIn: bi,
            MbOut: bo/8/1024,
            MbIn: bi/8/1024,
    }
  })

  data = reverse(sortBy(data, (d) => d.BytesOut + d.BytesIn))

  data.forEach((d) => {
    str = `${str}
     <tr>
       <td>${d.Name}</td>
       <td>${d.MbIn.toFixed(4)} mb</td>
       <td>${d.MbOut.toFixed(4)} mb</td>
     </tr>
    `
  })

  str = `${str}</tbody></table>`
  console.log(Object.keys(data).sort())
  dataView.innerHTML = str;
});
