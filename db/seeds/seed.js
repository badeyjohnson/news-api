const {
  topicsData, usersData, articlesData, commentsData,
} = require('../data');

const { createLookup, replaceKey, dateFormat } = require('../utils');

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex('topics')
      .insert(topicsData)
      .returning('*'))
    .then(() => knex('users')
      .insert(usersData)
      .returning('*'))
    .then(() => {
      const articlesDataTimeReformat = articlesData.map((article) => {
        return { ...article, created_at: dateFormat(article.created_at) };
      });
      return knex('articles')
        .insert(articlesDataTimeReformat)
        .returning('*');
    })
    .then((insertedArticles) => {
      const lookupArticleIdTable = createLookup(insertedArticles, 'article_title', 'article_id');
      const commentsWithArticleId = replaceKey(
        commentsData,
        lookupArticleIdTable,
        'article',
        'belongs_to',
      );
      const commentsDataTimeReformat = commentsWithArticleId.map((comment) => {
        return { ...comment, created_at: dateFormat(comment.created_at) };
      });
      return knex('comments')
        .insert(commentsDataTimeReformat)
        .returning('*');
    });
};
