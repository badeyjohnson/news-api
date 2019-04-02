process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {
    describe('/topics', () => {
      it('GET status:200 returns all topics', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.be.lengthOf(2);
            topics.forEach(topic => expect(topic).to.contain.keys('slug', 'description'));
          });
      });
    });
    describe('/articles', () => {
      it('GET status:200 returns all articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.lengthOf(12);
            articles.forEach(article => expect(article).to.contain.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'author',
              'created_at',
            ));
          });
      });
    });
  });
});
