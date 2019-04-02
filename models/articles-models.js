const connection = require('../db/connection');

exports.getAllArticles = () => {
  return connection.select('*').from('articles');
};

exports.getByArticleId = ({ article_id }) => {
  return connection
    .select('*')
    .from('articles')
    .where({ article_id });
};
