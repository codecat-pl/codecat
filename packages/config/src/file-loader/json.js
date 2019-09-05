const fs = require('fs');

class JSONLoader {
  handle(config) {
    const data = fs.readFileSync(config);
    return JSON.parse(data.toString());
  }
}

module.exports = JSONLoader;
