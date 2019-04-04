const { getUser } = require('../models/users-models');

exports.fetchUser = (req, res, next) => {
  getUser(req.params).then((user) => {
    if (user.length === 0) {
      next({ status: 404, msg: 'User does not exist' });
    } else {
      res.status(200).json({ user });
    }
  });
};
