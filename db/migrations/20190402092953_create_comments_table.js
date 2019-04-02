
exports.up = function(knex, Promise) {
  console.log('creating comments table...');
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increment('comment_id').notNullable().primary();
    commentsTable.text('comment_body').notNullable();
    commentsTable.integer('comment_votes').notNullable().defaultTo(0);
    commentsTable.string('comment_author').references('user_username').inTable('users');
    commentsTable.string('comment_article_id').references('article_id').inTable('articles');
    commentsTable.timestamp('comment_created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  console.log('removing comments tables...');
  return knex.schema.dropTable('comments');
};
