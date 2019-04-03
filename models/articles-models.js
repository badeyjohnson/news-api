const connection = require('../db/connection');

exports.getArticles = ({ article_id }) => {
  return connection
    .select()
    .from('articles')
    .modify((queryBuilder) => {
      if (article_id !== undefined) queryBuilder.where({ article_id });
    });
};

exports.patchArticle = ({ article_id }, { inc_votes }) => {
  return connection('articles')
    .where({ article_id })
    .increment('votes', inc_votes)
    .returning('*');
};
