// Set default node environment to development
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // eslint-disable-line no-process-env

// Register the Babel require hook for ES6 ony fly compilation for test and development environment
// For production environment it's not necessary because production code is precompiled and transpilted by webpack and babel
if(env === 'development' || env === 'test') {
  require('babel-register');
  require('babel-polyfill');
}
