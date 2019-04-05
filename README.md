# news-api

An news-api which interacts with a database holding articles grouped via topic. Articles are created by valid users, and can be commented on and voted on. The comments can also be voted on.

## Getting started
How to get a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
 - Node.js [https://nodejs.org/en/]
 - PostgreSQL [www.postgresql.org]

### Installing
 1. Clone this repo to your local machine
 2. In the local repo, run the following in your bash shell to install required node packages
 ```bash
npm i
```
 3. Create a file named knexfile.js in the top level directory. This will be used to configure the database connection. Inside paste the following (uncomment and fill out postgreSQL username and passwords if running Ubuntu):

```js
const { DATABASE_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfigs = {
  production: {
    connection: `${DATABASE_URL}?ssl=true`,
  },
  development: {
    connection: {
      database: 'news-api',
      // username: "<postgreSQL username for Ubuntu users>",
      // password: "<postgreSQL password for Ubuntu users>",
    },
  },
  test: {
    connection: {
      database: 'news-api_test',
      // username: "<postgreSQL username for Ubuntu users>",
      // password: "<postgreSQL password for Ubuntu users>",
    },
  },
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
```
 4. Now setup up local development and testing databases on your machine by running the bash command:
```bash
npm run setup-dbs
 ```
This will create two empty databases, news-api (for development) and news-api_test (for testing).

----

## Test environment
 To seed the test database with data, run the bash command:
```bash
npm run seed
```
Your database now has example data and is ready for testing.

Running the tests is the easiest way to check the databases and project are installed correctly and working as intended.

To __run the tests__, run the bash command:
```bash
npm run test
```
This will run the test files on the api using the test database. It will also test the util-helper functions required.

----

## Development environment
The development data can be accessed through localhost after running in bash:
```bash
npm run dev
```
This seeds the dev database with data and using nodemon starts listening on port 9090 (shown in the console). The port can be changed in the listen.js file.

To access the endpoints, put the following URL into your browser:

http://localhost:9090/api

This will list all available URL endpoints.

### __Example__

After running in bash:
```bash
npm run dev
```
Enter http://localhost:9090/api/users/grumpy19 into a local browser to access information about user 'grumpy19':
```json
{ "user":
  [{ "username": "grumpy19",
     "avatar_url": "https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg",
     "name": "Paul Grump" }]
    }
```


### __Functionality__
 - to create a query, amend to the URL: ?votes=10
 - to order the results, amend to the URL: ?sort_by=votes
 - to sort ascending, amend to the URL ?order=asc
 - to sort descending, amend to the URL ?order=desc
 - pagination - defaults page 1, change the page by amending URL ?p=2
 - number per page - defaults to 25, change by amending URL ?limit=10

For example:

https://localhost:9090/api/articles?author=jessjelly&order=desc&sort_by=comment_count

will display articles, where the author is jessjelly, sorted by the number of comments for each article (in descending order)

----


## Deployment
The project has been built to be deployed on heroku.

https://baj-news.herokuapp.com/api

To achieve such high flying success...
  1. Create a free heroku acount to host your api [https://www.heroku.com]
  2. Install heroku globally on your local machine:
  ```bash
  npm i -g heroku
  ```
  3. In your local project folder, login to heroku using the bash command:
  ```bash
  heroku login
  ```
  4. Create a heroku app (this can be also be done through the browser), by typing in bash:
  ```bash
  heroku create <app name>
  ```
  (You may need to add this remote to your local git repo if you made the app through your browser. Try in bash: "heroku git:remote -a \<app-name\>")

  5. Via the heroku website, choose your app and through resources, 'add-on' Heroku-Postgres. This will provide a hosted psql database.

  6. Add the database URL to your config by running the bash command:
  ```bash
  heroku config:get DATABASE_URL
  ```

  7. Push your code to the heroku app:
  ```bash
  git push heroku master 
  ```

  8. You can now access the database through:
  ```bash
  heroku open
  ```

  9. View the command logs in terminal using:
  ```bash
  heroku logs --tail
  ```

----

## Built With
 - pg [https://node-postgres.com/]
 - Yo [https://yeoman.io/]
 - Express [https://expressjs.com/]
 - Knex [https://knexjs.org/]


## Available Scripts

Create a new migration file:

```bash
npm run migrate-make <filename>
```

Run all migrations:

```bash
npm run migrate-latest
```

Rollback all migrations:

```bash
npm run migrate-rollback
```

Run tests:

```bash
npm test
```

Run the server with `node`:

```bash
npm start
```

----

## Acknowledgments
 - The kind folks at Northcoders