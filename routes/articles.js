const articlesRouter = require('express').Router();
const { fetchArticles, updateArticle } = require('../controllers/articles-controller');
const { methodNotAllowed } = require('../errors');

articlesRouter.route('/').get(fetchArticles);

articlesRouter
  .route('/:article_id')
  .get(fetchArticles)
  .patch(updateArticle)
  .all(methodNotAllowed);

module.exports = { articlesRouter };
