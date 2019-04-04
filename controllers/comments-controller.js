const { getComments, postComment, patchComment } = require('../models/comments-models');

exports.fetchComments = (req, res, next) => {
  getComments(req.query, req.params).then((comments) => {
    res.status(200).json({ comments });
  });
};

exports.addComment = (req, res, next) => {
  if (!req.body.username || !req.body.body) {
    next({ status: 400, msg: 'Incomplete comment' });
  }
  postComment(req.params, req.body)
    .then((comment) => {
      res.status(202).json({ comment });
    })
    .catch(() => {
      next({ status: 403, msg: 'Sign in to post a comment' });
    });
};

exports.updateComment = (req, res, next) => {
  patchComment(req.params, req.body).then((comment) => {
    res.status(200).json({ comment });
  });
};
