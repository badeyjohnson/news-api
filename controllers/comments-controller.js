const { getComments, postComment } = require('../models/comments-models');

exports.fetchComments = (req, res, next) => {
  getComments(req.query, req.params).then((comments) => {
    res.status(200).json({ comments });
  });
};

exports.addComment = (req, res, next) => {
  postComment(req.params, req.body).then((comment) => {
    res.status(202).json({ comment });
  });
};
