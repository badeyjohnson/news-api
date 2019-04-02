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
            expect(topics).to.be.lengthOf(5);
            topics.forEach(topic => expect(topic).to.contain.keys('topic_name', 'topic_description'));
          });
      });
    });
    describe('/articles', () => {
      it('GET status:200 returns all articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.lengthOf(4);
            articles.forEach(article => expect(article).to.contain.keys(
              'article_id',
              'article_title',
              'article_body',
              'article_votes',
              'article_topic',
              'article_author',
              'article_created_at',
            ));
          });
      });
    });
  });
});
