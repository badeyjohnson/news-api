const articlesRouter = require('express').Router();
const { fetchArticles, fetchByArticleId } = require('../controllers/articles-controller');
const { methodNotAllowed } = require('../errors');

articlesRouter.route('/').get(fetchArticles);

articlesRouter
  .route('/:article_id')
  .get(fetchByArticleId)
  .all(methodNotAllowed);

module.exports = { articlesRouter };
