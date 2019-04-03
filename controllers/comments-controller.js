const { getComments } = require('../models/comments-models');

exports.fetchComments = (req, res, next) => {
  getComments(req.params).then((comments) => {
    res.status(200).json({ comments });
  });
};