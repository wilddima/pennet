const { createConnection } = require('net');
const { spawn } = require('child_process');

const subprocess = spawn('./pennet');

subprocess.on('error', (err) => {
  console.log(err);
});

const client = createConnection({ port: 12345 }, () => {
  console.log('connected to server!');
  client.write('world!\r\n');
});

client.on('error', (err) => console.log(err))

client.on('data', (data) => {
  console.log(data.toString());
});

client.on('end', () => {
  console.log('disconnected from server');
});
