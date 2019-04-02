const connection = require('../db/connection');

exports.getArticles = ({ article_id }) => {
  return connection
    .select()
    .from('articles')
    .modify((queryBuilder) => {
      if (article_id !== undefined) queryBuilder.where({ article_id });
    });
};
