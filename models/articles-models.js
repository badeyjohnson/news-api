const connection = require('../db/connection');

exports.getArticles = ({ ...queries }, { article_id }) => {
  //console.log(queries)
  return connection
    .select(
      'author',
      'title',
      'articles.article_id',
      'topic',
      'articles.created_at',
      'articles.votes',
    )
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comment_id as comment_count')
    .groupBy('articles.article_id')
    .orderBy('articles.article_id')
    .where(queries)
    .modify((queryBuilder) => {
      if (article_id !== undefined) queryBuilder.where({ 'articles.article_id': article_id });
    });
};

exports.patchArticle = ({ article_id }, { inc_votes }) => {
  return connection('articles')
    .where({ article_id })
    .increment('votes', inc_votes)
    .returning('*');
};
