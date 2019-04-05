const {
  getComments,
  postComment,
  patchComment,
  deleteComment,
} = require('../models/comments-models');

exports.fetchComments = (req, res, next) => {
  getComments(req.query, req.params)
    .then((comments) => {
      if (comments.length === 0 && Object.keys(req.params).length) {
        next({ status: 404, msg: 'Article does not exist' });
      } else {
        res.status(200).json({ comments });
      }
    })
    .catch(() => {
      next({ status: 400, msg: 'Invalid article number' });
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
  patchComment(req.params, req.body)
    .then((comment) => {
      if (comment.length === 0) {
        next({ status: 404, msg: 'Comment does not exist' });
      } else {
        res.status(200).json({ comment });
      }
    })
    .catch(() => {
      next({ status: 400, msg: 'Invalid request' });
    });
};

exports.removeComment = (req, res, next) => {
  deleteComment(req.params)
    .then((response) => {
      if (response.length === 0) {
        next({ status: 404, msg: "Comment already doesn't exist" });
      } else {
        res.status(204).json();
      }
    })
    .catch(() => {
      next({ status: 400, msg: 'Invalid comment number' });
    });
};
