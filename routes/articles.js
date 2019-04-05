const articlesRouter = require('express').Router();
const { fetchArticles, fetchArticle, updateArticle, removeArticle } = require('../controllers/articles-controller');
const { fetchComments, addComment } = require('../controllers/comments-controller');
const { methodNotAllowed } = require('../errors');

articlesRouter
  .route('/')
  .get(fetchArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(fetchArticle)
  .patch(updateArticle)
  .delete(removeArticle)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .get(fetchComments)
  .post(addComment)
  .all(methodNotAllowed);

module.exports = { articlesRouter };
