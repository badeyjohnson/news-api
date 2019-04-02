const {
  topicsData, usersData, articlesData, commentsData,
} = require('../data');

const { createLookup, replaceKey } = require('../utils');

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
    .then(() => knex('articles')
      .insert(articlesData)
      .returning('*'))
    .then(insertedArticles => knex('comments')
      .insert(commentsData)
      .returning('*'));
};
