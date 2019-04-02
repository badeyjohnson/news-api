
exports.up = function(knex, Promise) {
  console.log('creating users table...');
  return knex.schema.createTable('users', (usersTable) => {
    usersTable.string('user_username').notNullable().primary().unique();
    usersTable.string('user_avatar_url').notNullable().unique();
    usersTable.string('user_name').notNullable();
  });
};

exports.down = function(knex, Promise) {
  console.log('removing users tables...');
  return knex.schema.dropTable('users');
};
