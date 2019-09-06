
const ipc = require('node-ipc');

ipc.config.id = 'worker';
ipc.config.retry = 1500;
//ipc.config.silent = true;

console.log('starting worker');
ipc.connectTo('server', () => {
  ipc.of.server.on('connect', () => {
    ipc.log('## connected to world ##', ipc.config.delay);
    ipc.of.server.emit('message', {complex: "hello"});
    ipc.disconnect('server');
  });
  ipc.of.server.on('disconnect',() => {
    ipc.log('disconnected from world');
  });
});


