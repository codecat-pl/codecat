const {should} = require('chai');
const path = require('path');
const Joi = require('@hapi/joi');
const ConfigLoader = require('../src/index');

should();

describe('ConfigLoader',() => {
  const fixtureSchema = Joi.object().keys({
    test: Joi.number(),
    defaultValue: Joi.string().default('test'),
    type: Joi.string().default('none'),
    yamlOnlyProp: Joi.bool(),
    jsonOnlyProp: Joi.bool()
  });
  describe('#load()', ()=>{

    it('should load object and return it', () => {
      ConfigLoader()
        .load({test: 1})
        .should.have.property('test', 1);
    });

    it('should validate object with schema - positive case',  () => {
      ConfigLoader(fixtureSchema)
        .load({test: 1})
        .should.have.property('test', 1);
    });

    it('should validate object with schema and fill default value',  () => {
      ConfigLoader(fixtureSchema)
        .load({test: 1})
        .should.have.property('defaultValue', 'test');
    });

    it('should load file if arg is a string - JSON', () => {
      ConfigLoader(fixtureSchema)
        .load(path.join(__dirname, './fixtures/conf.json'))
        .should.have.property('type', 'JSON');
    });

    it('should load file if arg is a string - YAML', () => {
      ConfigLoader(fixtureSchema)
        .load(path.join(__dirname, './fixtures/conf.yml'))
        .should.have.property('type', 'YAML');
    });

    it('should load file if arg is a string - JS', () => {
      ConfigLoader(fixtureSchema)
        .load(path.join(__dirname, './fixtures/conf.js'))
        .should.have.property('type', 'JS');
    });


    it('should validate object with schema - negative case',  () => {
      try {
        ConfigLoader(fixtureSchema)
          .load({test: 'errors'});
        return Promise.reject();
      }catch(err){
        err.name.should.eql('ValidationError');
      }
    });
  });

  describe('directives', () => {
    describe('$include', () => {
      it('should load file', () => {
        const config = ConfigLoader().load({$include: path.join(__dirname, './fixtures/conf.yml')});
        config.should.have.property('type', 'YAML');
      });
      it('should load file in nested property', () => {
        const config = ConfigLoader().load({nested: {$include: path.join(__dirname, './fixtures/conf.yml')}});
        config.should.have.property('nested');
        config.nested.should.have.property('type', 'YAML');
      });
      it('should load multiple files', () => {
        const config = ConfigLoader(fixtureSchema, {allowUnknown: true}).load({$include: [
          path.join(__dirname, './fixtures/conf.yml'),
          path.join(__dirname, './fixtures/conf.json'),
        ], testProp: true, type: 'composite'});
        config.should.have.property('type', 'composite');
        config.should.have.property('jsonOnlyProp', true);
        config.should.have.property('yamlOnlyProp', true);
        config.should.have.property('testProp', true);
      });

      it('should load config files relative to each other', () => {
        const config = ConfigLoader().load(path.join(__dirname, './fixtures/root.yml'));
        config.should.have.property('type', 'YAML-root');
        config.should.have.property('tree');
        config.tree.should.have.property('type', 'YAML-leaf');
      });

      it('should integrate', () => {
        const schema = Joi.object().keys({
          json: fixtureSchema,
          yaml: fixtureSchema
        });
        const config = ConfigLoader(schema).load({
          json: {$include: path.join(__dirname, './fixtures/conf.json')},
          yaml: {$include: path.join(__dirname, './fixtures/conf.yml')}
        });
        config.should.have.property('json');
        config.should.have.property('yaml');
        config.json.should.have.property('type', 'JSON');
      });
    });
    describe('$env', () => {
      it('should set value from env', () => {
        process.env.TYPE = 'envVariable';
        const config = ConfigLoader().load({type: {$env: 'TYPE'}});
        config.should.have.property('type', 'envVariable');
      })
      it('should set value from env in nested prop', () => {
        process.env.TYPE = 'envVariable';
        const config = ConfigLoader().load({nested: {type: {$env: 'TYPE'}}});
        config.should.have.property('nested');
        config.nested.should.have.property('type', 'envVariable');
      })
    });
    describe('$resolve-path', () => {
      it('should resolve path relative to file', () => {
        const config = ConfigLoader().load(path.join(__dirname, './fixtures/resolvePath.yml'));
        config.should.have.property('test', path.resolve(path.join(__dirname, './fixtures/conf.yml')))

      })
    });
  });
});
