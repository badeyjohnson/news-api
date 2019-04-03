const connection = require('../db/connection');

exports.getComments = ({ sort_by = 'created_at', order = 'desc', ...queries },{ article_id }) => {
  return connection
    .select('comments.created_by as author', 'comment_id', 'comments.created_at', 'comments.votes', 'comments.body')
    .from('comments')
    .leftJoin('articles', 'comments.article_id', 'articles.article_id')
    .orderBy(sort_by, order)
    .where({ 'comments.article_id': article_id })
};
