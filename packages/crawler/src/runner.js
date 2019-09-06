
const ipc = require('node-ipc');
const { fork } = require('child_process');

ipc.config.id = 'server';
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.config.logger = console.log.bind(console);
ipc.serve(() => {
  fork('./src/worker.js', ['worker1']);
  ipc.server.on('message', (data, socket) => {
    console.log('data', data);
    ipc.log('got a message : ', data);
  });
  ipc.server.on('socket.disconnected', (socket, destroyedSocketID) => {
    ipc.log('client ' + destroyedSocketID + ' has disconnected!');
  })
});

ipc.server.start();
