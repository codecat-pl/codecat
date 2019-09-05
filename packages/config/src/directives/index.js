const IncludeDirective = require('./include');
const EnvDirective = require('./env');
const ResolvePathDirective = require('./resolvePath');

class Directives {
  constructor(directives){
    this.directives = directives;
  }

  isTraversable(object){
    return typeof object === 'object' && object !== null;
  }

  traverse(config, ctx){
    for(const name in config){
      if(this.isTraversable(config[name])){
        config[name] = this.handle(config[name], ctx);
      }
    }
    return config;
  }

  visit(config, ctx){
    if(!Array.isArray(config)) {
      for (const handler of this.directives) {
        if(handler.willVisit(config, ctx)) {
          config = handler.visit(config, ctx);
        }
      }
    }
    return config;
  }

  handle(config, ctx){
    config = this.traverse(config, ctx);
    config = this.visit(config, ctx);
    return config;
  }
}

module.exports = new Directives([
  new ResolvePathDirective(),
  new IncludeDirective(),
  new EnvDirective()
]);
