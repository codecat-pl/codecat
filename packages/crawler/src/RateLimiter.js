class RateLimiter {
  constructor(handler, rate) {
    this.handler = handler;
    this.rate = rate;
    this.queue = [];
    this.running = false;
    this.promise = undefined;
  }
  async handle(tasks){
    if(!Array.isArray(tasks)) tasks = [tasks];
    tasks.forEach(t => this.queue.push(t));
    this.promise = this._exec();
    return this;
  }
  async _exec(){
    if (this.running) return;
    this.running = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      await this.handler.handle(task);
      await this._cooldown()
    }
    this.running = false;
  }
  async _cooldown() {
    return new Promise(ok => setTimeout(ok, this.rate));
  }
}

module.exports = RateLimiter;
