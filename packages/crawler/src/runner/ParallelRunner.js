const Queue = require('../Queue');
const IPC = require('node-ipc').IPC;
const shortId = require('shortid');
const { fork } = require('child_process');

class ParallelLimiter extends Queue{
  constructor(module){
    super();
    this.ipc = new IPC();
    this.ipc.config.id = this.id = shortId();
    this.module = module;
  }
  async _handleNext(task){
    fork(this.module, [this.id, shortId()]);
  }
}

module.exports = ParallelLimiter;
