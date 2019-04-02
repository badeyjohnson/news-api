const { getAllArticles, getByArticleId } = require('../models/articles-models');

exports.fetchArticles = (req, res, next) => {
  getAllArticles().then((articles) => {
    res.status(200).json({ articles });
  });
};

exports.fetchByArticleId = (req, res, next) => {
  getByArticleId(req.params).then((article) => {
    res.status(200).json({ article });
  });
};
