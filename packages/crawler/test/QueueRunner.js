const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.use(sinonChai);
chai.should();

const QueueRunner = require('../src/QueueRunner');
const Task = require('../src/Task');

describe('QueueRunner', () => {
  const TASK0 = new Task('test0');
  const TASK1 = new Task('test1');
  const TASK2 = new Task('test2');
  let queue;

  beforeEach(() => {
    queue = new QueueRunner(sinon.stub());
  });

  it('should run task', async () => {
    queue.push(TASK0);
    await queue.run();
    queue.handle.should.have.been.calledWithExactly(TASK0);
  });

  it('should run all tasks', async () => {
    queue.push(TASK0);
    queue.push(TASK1);
    queue.push(TASK2);
    await queue.run();
    queue.handle.should.have.been.calledWithExactly(TASK0);
    queue.handle.should.have.been.calledWithExactly(TASK1);
    queue.handle.should.have.been.calledWithExactly(TASK2);
  });
});
