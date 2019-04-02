exports.up = function (knex, Promise) {
  console.log('creating topics table...');
  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable
      .string('topic_name')
      .notNullable()
      .primary()
      .unique();
    topicsTable.string('topic_description').notNullable();
  });
};

exports.down = function (knex, Promise) {
  console.log('removing topics tables...');
  return knex.schema.dropTable('topics');
};
