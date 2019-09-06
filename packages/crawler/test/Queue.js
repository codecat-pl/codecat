const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.use(sinonChai);
chai.should();

const Queue = require('../src/Queue');
const Task = require('../src/Task');

describe('Queue', () => {
  const TASK0 = new Task('test0');
  const TASK1 = new Task('test1');
  let queue;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    queue = new Queue();
    sinon.stub(queue.runner, 'push');
    sinon.stub(queue.runner, 'run');
  });

  it('should push tasks to queue', async () => {
    queue.handle(TASK0);
    queue.runner.push.should.have.been.calledWithExactly(TASK0);
  });

  it('should start runner only once', async () => {
    queue.handle(TASK0);
    queue.handle(TASK1);
    queue.runner.run.should.have.been.calledOnce;
  });

  it('should start runner again if it stopped working', async () => {
    queue.handle(TASK0);
    await Promise.resolve();
    queue.handle(TASK1);
    queue.runner.run.should.have.been.calledTwice;
  });
});
