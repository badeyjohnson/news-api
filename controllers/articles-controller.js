const { getArticles } = require('../models/articles-models');

exports.fetchArticles = (req, res, next) => {
  getArticles(req.params)
    .then((articles) => {
      res.status(200).json({ articles });
    })
    .catch(() => next({ status: 404, msg: 'Invalid article number' }));
};
