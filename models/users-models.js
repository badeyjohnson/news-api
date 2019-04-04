const connection = require('../db/connection');

exports.getUser = ({ username }) => {
  return connection.select('*').from('users').where({ username });
};
