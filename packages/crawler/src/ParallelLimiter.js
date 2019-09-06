const Queue = require('./Queue');
const Semaphore = require('semaphore');

class ParallelLimiter extends Queue{
  constructor(handler, limit) {
    super();
    this.handler = handler;
    this.sem = Semaphore(limit);
  }

  async _handleNext(task) {
    await this._take();
    await this.handler.handle(task);
    this._leave();
  }

  _take() {
    return new Promise(resolve => this.sem.take(resolve));
  }
  _leave() {
    this.sem.leave();
  }
}

module.exports = ParallelLimiter;
