class QueueRunner {
  constructor(handle){
    this.queue = [];
    this.handle = handle;
  }
  push(t){
    this.queue.push(t);
  }
  async run(){
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      await this.handle(task);
    }
  }
}

module.exports = QueueRunner;
