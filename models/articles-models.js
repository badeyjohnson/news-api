const connection = require('../db/connection');

exports.getArticles = ({ sort_by, order, limit = 25, p = 1, ...queries }, { article_id }) => {
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

  sort_by = validQueries.includes(sort_by) ? sort_by : 'created_at';

  order = ['asc', 'desc'].includes(order) ? order : 'desc';
  
  const offset = (p - 1) * limit;

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
    .limit(limit)
    .offset(offset)
    .modify((queryBuilder) => {
      if (article_id !== undefined) queryBuilder.select('articles.body').where({ 'articles.article_id': article_id });
    });
};

exports.getArticle = ({ article_id }) => {
  return connection
    .select(
      'author',
      'title',
      'articles.article_id',
      'topic',
      'articles.body',
      'articles.created_at',
      'articles.votes',
    )
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comment_id as comment_count')
    .groupBy('articles.article_id')
    .where({ 'articles.article_id': article_id });
};

exports.patchArticle = ({ article_id }, { inc_votes }) => {
  return connection('articles')
    .where({ article_id })
    .increment('votes', inc_votes || 0)
    .returning('*');
};

exports.deleteArticle = ({ article_id }) => {
  return connection('articles')
    .where({ article_id })
    .del()
    .returning('*');
};
