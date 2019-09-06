const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.use(sinonChai);
chai.should();

const Task = require('../src/Task');
const ParallelLimiter = require('../src/ParallelLimiter');

describe('ParallelLimiter', () => {
  afterEach(()=>{
    sinon.restore();
  });
  let parallelLimiter;
  let task0 = new Task('http://example.com/');
  let task1 = new Task('http://example.com/1');
  let nextHandler = {
    handle: sinon.stub().resolves()
  };
  beforeEach(() => {
    parallelLimiter = new ParallelLimiter(nextHandler, 1)
  });

  it('should run', async () => {
    await parallelLimiter.handle(task0);
    nextHandler.handle.should.have.been.calledWithExactly(task0);
  });
  it('should not run next task until first completes', async () => {
    let resolve;
    const promise = new Promise((ok) => resolve = ok);
    nextHandler.handle.returns(promise);
    await parallelLimiter.handle(task0);
    await parallelLimiter.handle(task1);
    await new Promise(process.nextTick);
    nextHandler.handle.should.not.have.been.calledWithExactly(task1);
    resolve();
    await new Promise(process.nextTick);
    nextHandler.handle.should.have.been.calledWithExactly(task1);
  });
});
