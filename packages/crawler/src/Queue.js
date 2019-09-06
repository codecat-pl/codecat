const QueueRunner = require('./QueueRunner');

class Queue {
  constructor() {
    this.runner = new QueueRunner(this._handleNext.bind(this));
    this.running = false;
  }

  async handle(task){
    this.runner.push(task);
    if(!this.running) this._loop();
  }

  async _handleNext(task){}

  async _loop(){
    this.running = true;
    try {
      await this.runner.run();
    }catch(err){
      console.error(err);
    }
    this.running = false;
  }
}

module.exports = Queue;
