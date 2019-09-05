const path = require('path');

class EnvDirective {
  willVisit(object) {
    return !!object.$resolvePath;
  }
  visit(object, ctx){
    return path.resolve(path.join(ctx.workdir, object.$resolvePath));
  }
}

module.exports = EnvDirective;
