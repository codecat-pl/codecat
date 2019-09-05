
class IncludeDirective {
  willVisit(object) {
    return !!object.$include;
  }
  visit(object, ctx){
    const {$include, ...rest} = object;
    const files = Array.isArray($include) ? $include : [$include];
    let ret = {};
    for(const file of files) {
      ret = {...ret, ...ctx.createSubContext().load(file)};
    }
    return {...ret, ...rest};
  }
}

module.exports = IncludeDirective;
