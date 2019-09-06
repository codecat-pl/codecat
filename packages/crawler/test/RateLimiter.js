const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.use(sinonChai);
chai.should();

const Task = require('../src/Task');
const RateLimiter = require('../src/RateLimiter');

describe('RateLimiter', () => {
  afterEach(()=>{
    sinon.restore();
  });
  const TASK_RATE = 1000;
  let nextHandler;
  let task0, task1, task2;
  let rateLimiter;
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    task0 = new Task('http://example.com/');
    task1 = new Task('http://example.com/1');
    task2 = new Task('http://example.com/2');
    nextHandler = {
      handle: sinon.stub().resolves()
    };
    rateLimiter = new RateLimiter(nextHandler, TASK_RATE);
  });

  it('should handle task', () => {
    rateLimiter.handle(task0);
    nextHandler.handle.should.have.been.calledOnceWithExactly(task0);
  });

  it('should start only if not running', async() => {
    await simulate(rateLimiter, [[task0, task1], 10, task2, 10]);
    nextHandler.handle.should.have.been.calledOnce;
  });

  it('should handle also tasks added on-flight', async() => {
    await simulate(rateLimiter, [[task0, task1], 10, task2, TASK_RATE, TASK_RATE]);
    nextHandler.handle.should.have.been.calledThrice;
    nextHandler.handle.should.have.been.calledWithExactly(task2);
  });

  it('should restart queue if it stopped working', async() => {
    await simulate(rateLimiter, [[task0, task1], TASK_RATE, TASK_RATE, task2, 10]);
    nextHandler.handle.should.have.been.calledWithExactly(task2);
  });

  it('should keep delay on restart', async() => {
    await simulate(rateLimiter, [[task0, task1], TASK_RATE, task2, 10]);
    nextHandler.handle.should.not.have.been.calledWithExactly(task2);
  });

  [100,1000,10000]. forEach(rate => describe(`Rate limiting ${rate}ms`, () => {
    beforeEach(()=>{
      rateLimiter = new RateLimiter(nextHandler, rate);
    });
    it('should handle 2 tasks', async() => {
      await simulate(rateLimiter, [[task0, task1, task2], rate-1]);
      nextHandler.handle.should.not.have.been.calledTwice;
      await simulate(rateLimiter, [2]);
      nextHandler.handle.should.have.been.calledTwice;
      nextHandler.handle.should.have.been.calledWithExactly(task1);
    });
    it('should handle 3 tasks', async() => {
      await simulate(rateLimiter, [[task0, task1, task2], rate, rate-1]);
      nextHandler.handle.should.not.have.been.calledThrice;
      await simulate(rateLimiter, [2]);
      nextHandler.handle.should.have.been.calledThrice;
      nextHandler.handle.should.have.been.calledWithExactly(task2);
    });
  }));

  async function simulate(q, timeline){
    for (const thing of timeline){
      if (Array.isArray(thing)) {
        await Promise.all(thing.map(t => q.handle(t)));
      } else if( thing instanceof Task) {
        await q.handle(thing);
      } else {
        await wait(thing);
      }
    }
  }

  async function wait(time){
    await new Promise(process.nextTick);
    clock.tick(time);
    await new Promise(process.nextTick);
  }
});

