const commentsRouter = require('express').Router();
const { updateComment, removeComment } = require('../controllers/comments-controller');
const { methodNotAllowed } = require('../errors');

commentsRouter
  .route('/:comment_id')
  .patch(updateComment)
  .delete(removeComment)
  .all(methodNotAllowed);

module.exports = { commentsRouter };
