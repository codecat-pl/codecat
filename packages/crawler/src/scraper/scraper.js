const request = require('request');
const Task = require('../Task');
const loader = {
  async load(task) {
    return new Promise((resolve, reject) => {
      request(task.url, (err, res, body) => {
        if(err) return reject(err);
        resolve(body);
      })
    })
  }
};

const parser = {
  async parse(task) {
    return JSON.parse(task.content).data[0];
  }
};

const storage = {
  save(task){
    console.log(task.url);
    console.log(task.data);
  }
};

const scrape = async (task) => {
  task.content = await loader.load(task);
  task.data = await parser.parse(task);
  await storage.save(task);
};

module.exports = scrape;

it('run', async () => {
  await scrape(new Task('https://reqres.in/api/users'));
});
