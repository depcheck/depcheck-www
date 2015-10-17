import configuration from './configuration';

const provider = configuration.provider || 'local';

// TODO module loader is not standardized in ES6 spec, fallback to node.js require function. See https://github.com/ModuleLoader/es6-module-loader
export default require('./' + provider);
