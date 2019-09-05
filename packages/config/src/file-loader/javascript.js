const fs = require('fs');

class JSONLoader {
  handle(config) {
    return require(config);
  }
}

module.exports = JSONLoader;
