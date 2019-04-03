const { getArticles, patchArticle } = require('../models/articles-models');

exports.fetchArticles = (req, res, next) => {
  getArticles(req.params)
    .then((articles) => {
      if (articles.length === 0) {
        next({ status: 404, msg: 'Article does not exist' });
      } else {
        res.status(200).json({ articles });
      }
    })
    .catch(() => next({ status: 404, msg: 'Invalid article number' }));
};

exports.updateArticle = (req, res, next) => {
  patchArticle(req.params, req.body)
    .then((article) => {
      res.status(200).json({ article })
    })
}