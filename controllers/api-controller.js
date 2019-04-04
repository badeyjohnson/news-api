const endpoints = require('../endpoints');

exports.getAllRoutes = (req, res, next) => {
  res.status(200).json({ endpoints });
};
