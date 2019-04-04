const apiRouter = require('express').Router();
const { topicsRouter } = require('./topics');
const { articlesRouter } = require('./articles');
const { commentsRouter } = require('./comments');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = { apiRouter };
