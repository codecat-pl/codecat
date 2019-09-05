# @codecat/config
Configuration handling for projects.

#### Features
* Ability to load nested config files
* Ability to put ENV variables to in JSON and YAML
* Validation of loaded config file with use of `@hapi/joi`
* Resolving paths relative to config files

#### Usage
`configFile.yml` 
```yaml
port: 9000
```
`app.js`
```javascript
const ConfigLoader = require('@codecat/config');
const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  port: Joi.number().port().default(8000)
});

const config = ConfigLoader(schema).load('./configFile.yml');

console.log(config.port); // 9000
```

Currently YAML, JSON and JS files are supported.

#### TODO
[ ] ability to add more file loaders for different mime-types  
[ ] ability to define custom directives  
[ ] write some more info in README
