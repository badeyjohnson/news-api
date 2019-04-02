
exports.up = function(knex, Promise) {
  console.log('creating articles table...');
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').notNullable().primary();
    articlesTable.string('article_title').notNullable();
    articlesTable.text('article_body').notNullable();
    articlesTable.integer('article_votes').notNullable().defaultTo(0);
    articlesTable.string('article_topic').notNullable();
    articlesTable.string('article_author').references('user_username').inTable('users');
    articlesTable.timestamp('article_created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  console.log('removing articles tables...');
  return knex.schema.dropTable('articles');
};
