const { getArticles, patchArticle } = require('../models/articles-models');

exports.fetchArticles = (req, res, next) => {
  console.log(req.params)
  getArticles(req.params)
    .then((articles) => {
      console.log(articles)
      if (articles.length === 0) {
        next({ status: 404, msg: 'Article does not exist' });
      } else {
        res.status(200).json({ articles });
      }
    })
    .catch(() => next({ status: 400, msg: 'Invalid article number' }));
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
