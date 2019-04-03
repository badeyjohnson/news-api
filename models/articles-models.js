const connection = require('../db/connection');

exports.getArticles = ({ article_id }) => {
  return connection
    .select()
    .from('articles')
    .leftjoin('comments', 'articles.article_id', 'comments.belongs_to')
    .groupby('article_id')
    .count('comment_id')
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
