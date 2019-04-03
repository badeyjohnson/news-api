const { getArticles, patchArticle, deleteArticle } = require('../models/articles-models');

exports.fetchArticles = (req, res, next) => {
  getArticles(req.query, req.params)
    .then((articles) => {
      if (articles.length === 0 && Object.keys(req.params).length) {
        next({ status: 404, msg: 'Article does not exist' });
      } else {
        res.status(200).json({ articles });
      }
    })
    .catch((err) => {
      next({ status: 400, msg: 'Invalid article number' });
    });
};

exports.updateArticle = (req, res, next) => {
  patchArticle(req.params, req.body)
    .then((article) => {
      if (article.length === 0) {
        next({ status: 404, msg: 'Article does not exist' });
      } else {
        res.status(200).json({ article });
      }
    })
    .catch(() => next({ status: 400, msg: 'Invalid article number' }));
};

exports.removeArticle = (req, res, next) => {
  deleteArticle(req.params).then(() => {
    res.status(204).json();
  });
};
