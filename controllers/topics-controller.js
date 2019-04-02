const { getAllTopics } = require('../models/topics-models');

exports.fetchTopics = (req, res, next) => {
  getAllTopics().then((topics) => {
    console.log({ topics })
    res.status(200).json({ topics });
  });
};
