const { getUser } = require('../models/users-models');

exports.fetchUser = (req, res, next) => {
  getUser(req.params).then((user) => {
    res.status(200).json({ user });
  });
};
