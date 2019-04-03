const connection = require('../db/connection');

exports.getArticles = ({ sort_by, order, ...queries }, { article_id }) => {
  const validQueries = [
    'author',
    'title',
    'articles.article_id',
    'topic',
    'articles.created_at',
    'articles.votes',
    'comment_count',
  ];

  Object.keys(queries).forEach((key) => {
    if (!validQueries.includes(key)) {
      delete queries[key];
    }
  });

  if (!validQueries.includes(sort_by)) {
    sort_by = 'created_at';
  }

  if (!['asc', 'desc'].includes(order)) {
    order = 'desc';
  }

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
    .orderBy(sort_by, order)
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
