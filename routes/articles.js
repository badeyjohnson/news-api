const articlesRouter = require('express').Router();
const { fetchArticles } = require('../controllers/articles-controller');
const { methodNotAllowed } = require('../errors');

articlesRouter
  .route('/')
  .get(fetchArticles)
  .all(methodNotAllowed);

module.exports = { articlesRouter };