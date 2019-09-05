class ParallelLimiter {
  constructor(handler) {
    this.handler = handler;
  }
  async handle(task){
    return this.handler.handle(task);
  }
}

module.exports = ParallelLimiter;
