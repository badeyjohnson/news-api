const connection = require('../db/connection');

exports.getComments = ({ sort_by, order }, { article_id }) => {
  if (!['asc', 'desc'].includes(order)) {
    order = 'desc';
  }
  const validQueries = ['created_by', 'author', 'comment_id', 'created_at', 'votes'];
  if (!validQueries.includes(sort_by)) {
    sort_by = 'created_at';
  }
  return connection
    .select(
      'comments.created_by as author',
      'comment_id',
      'comments.created_at',
      'comments.votes',
      'comments.body',
    )
    .from('comments')
    .leftJoin('articles', 'comments.article_id', 'articles.article_id')
    .orderBy(sort_by, order)
    .where({ 'comments.article_id': article_id });
};

exports.postComment = ({ article_id }, { username, body }) => {
  return connection
    .insert({ created_by: username, body, article_id })
    .into('comments')
    .returning('*');
};
