const fileLoader = require('../src/file-loader');
const directives = require('../src/directives');

class BuildContext {
  constructor(schema, opts){
    this.workdir = process.env.PWD;
    this.config = undefined;
    this.schema = schema;
    this.opts = opts;
  }

  createSubContext(){
    const ctx = new BuildContext();
    ctx.workdir = this.workdir;
    return ctx;
  }

  build(input) {
    this.config = fileLoader.load(input, this);
    this.config = directives.handle(this.config, this);
    return this;
  }

  validate(){
    if(!this.schema) return this;
    const { error, value } = this.schema.validate(this.config, this.opts);
    if(error) throw error;
    this.config = value;
    return this;
  }

  load(config){
    return this.build(config).validate().getConfig();
  }

  getConfig(){
    return this.config;
  }
}


const ConfigLoader = (schema, opts) => {
  const context = new BuildContext(schema, opts);
  return {
    load(config){
      return context.load(config);
    }
  }
};

module.exports = ConfigLoader;
