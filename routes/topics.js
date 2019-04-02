const topicsRouter = require('express').Router();
const { fetchTopics } = require('../controllers/topics-controller');
const { methodNotAllowed } = require('../errors');

topicsRouter
  .route('/')
  .get(fetchTopics)
  .all(methodNotAllowed);

module.exports = { topicsRouter };
