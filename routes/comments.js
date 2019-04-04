const commentsRouter = require('express').Router();
const { updateComment } = require('../controllers/comments-controller');
const { methodNotAllowed } = require('../errors');

commentsRouter
  .route('/:comment_id')
  .patch(updateComment)
  .all(methodNotAllowed);

module.exports = { commentsRouter };
