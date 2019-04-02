const ENV = process.env.NODE_ENV || 'test';

const development = require('./dev-data');
const test = require('./test-data');

const data = {
  development,
  test,
};

console.log(data[ENV]);
module.exports = data[ENV];
