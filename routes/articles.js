const articlesRouter = require('express').Router();
const { fetchArticles, updateArticle, removeArticle } = require('../controllers/articles-controller');
const { fetchComments } = require('../controllers/comments-controller');
const { methodNotAllowed } = require('../errors');

articlesRouter
  .route('/')
  .get(fetchArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(fetchArticles)
  .patch(updateArticle)
  .delete(removeArticle)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .get(fetchComments)
  .all(methodNotAllowed);

module.exports = { articlesRouter };
