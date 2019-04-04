const usersRouter = require('express').Router();
const { fetchUser } = require('../controllers/users-controller');
const { methodNotAllowed } = require('../errors');

usersRouter
  .route('/:username')
  .get(fetchUser)
  .all(methodNotAllowed);

module.exports = { usersRouter };
