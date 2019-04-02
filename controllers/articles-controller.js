const { getAllArticles } = require('../models/articles-models');

exports.fetchArticles = (req, res, next) => {
  getAllArticles().then((articles) => {
    res.status(200).json({ articles });
  });
};
