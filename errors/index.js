exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method not allowed' });
};

exports.handle400s = (err, req, res, next) => {
  res.status(err.status).json({ msg: err.msg });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
