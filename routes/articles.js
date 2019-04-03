const articlesRouter = require('express').Router();
const { fetchArticles, updateArticle, removeArticle } = require('../controllers/articles-controller');
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

module.exports = { articlesRouter };
