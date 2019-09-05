

class EnvDirective {
  willVisit(object) {
    return !!object.$env;
  }
  visit(object){
    return process.env[object.$env];
  }
}

module.exports = EnvDirective;
