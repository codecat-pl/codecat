const fs = require('fs');
const YAML = require('yaml');

class YAMLLoader {
  handle(config) {
    const data = fs.readFileSync(config);
    return YAML.parse(data.toString());
  }
}

module.exports = YAMLLoader;
