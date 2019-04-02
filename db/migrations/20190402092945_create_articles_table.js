exports.up = function (knex, Promise) {
  //console.log('creating articles table...');
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable
      .increments('article_id')
      .notNullable()
      .primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable
      .integer('votes')
      .notNullable()
      .defaultTo(0);
    articlesTable
      .string('topic')
      .notNullable()
      .references('slug')
      .inTable('topics');
    articlesTable
      .string('author')
      .references('username')
      .inTable('users');
    articlesTable
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  //console.log('removing articles tables...');
  return knex.schema.dropTable('articles');
};
