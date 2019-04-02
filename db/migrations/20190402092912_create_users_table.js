exports.up = function (knex, Promise) {
  //console.log('creating users table...');
  return knex.schema.createTable('users', (usersTable) => {
    usersTable
      .string('username')
      .notNullable()
      .primary()
      .unique();
    usersTable
      .string('avatar_url')
      .notNullable()
      .unique();
    usersTable.string('name').notNullable();
  });
};

exports.down = function (knex, Promise) {
  //console.log('removing users tables...');
  return knex.schema.dropTable('users');
};
