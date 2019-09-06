const Queue = require('./Queue');

class RateLimiter extends Queue{
  constructor(handler, rate) {
    super();
    this.handler = handler;
    this.rate = rate;
  }
  async _handleNext(task){
    await this.handler.handle(task);
    return this._cooldown();
  }
  async _cooldown() {
    return new Promise(ok => setTimeout(ok, this.rate));
  }
}

module.exports = RateLimiter;
