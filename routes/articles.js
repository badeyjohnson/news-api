const articlesRouter = require('express').Router();
const { fetchArticles } = require('../controllers/articles-controller');
const { methodNotAllowed } = require('../errors');

articlesRouter.route('/').get(fetchArticles);

articlesRouter
  .route('/:article_id')
  .get(fetchArticles)
  .all(methodNotAllowed);

module.exports = { articlesRouter };
