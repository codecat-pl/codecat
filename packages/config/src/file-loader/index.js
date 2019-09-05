const path = require('path');
const mime = require('mime');

const JSONLoader = require('./json');
const YAMLLoader = require('./yaml');
const JSLoader = require('./javascript');

class FileLoader {
  constructor(loaders){
    this.loaders = loaders;
  }

  transformPath(filePath, ctx){
    return (!path.isAbsolute(filePath)) ?
      path.resolve(path.join(ctx.workdir, filePath)) :
      filePath;
  }

  changeWorkDir(config, ctx){
    ctx.workdir = path.dirname(config);
  }

  execHandler(absoluteFilePath){
    const type = mime.getType(absoluteFilePath);
    if(!this.loaders[type])
      throw new Error(`Unknown mimetype of config file ${path.basename(absoluteFilePath)} - ${type}`);
    return this.loaders[type].handle(absoluteFilePath);
  }

  load(filePath, ctx){
    if(typeof filePath !== 'string') return filePath;
    const absoluteFilePath = this.transformPath(filePath, ctx);
    this.changeWorkDir(absoluteFilePath, ctx);
    return this.execHandler(absoluteFilePath);
  }
}

module.exports = new FileLoader({
  'application/json': new JSONLoader(),
  'text/yaml': new YAMLLoader(),
  'application/javascript': new JSLoader()
});
