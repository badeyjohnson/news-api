exports.up = function (knex, Promise) {
  //console.log('creating comments table...');
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable
      .increments('comment_id')
      .notNullable()
      .primary();
    commentsTable.text('body').notNullable();
    commentsTable
      .integer('votes')
      .notNullable()
      .defaultTo(0);
    commentsTable
      .string('created_by')
      .references('username')
      .inTable('users');
    commentsTable
      .integer('article_id')
      .unsigned()
      .references('article_id')
      .inTable('articles')
      .onDelete('cascade');
    commentsTable
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  //console.log('removing comments tables...');
  return knex.schema.dropTable('comments');
};
