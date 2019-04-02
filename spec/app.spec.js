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
      describe('/articles/:article_id', () => {
        it('GET status:200 returns the requested article', () => {
          const article5 = [
            {
              article_id: 5,
              title: 'UNCOVERED: catspiracy to bring down democracy',
              topic: 'cats',
              author: 'rogersop',
              body: 'Bastet walks amongst us, and the cats are taking arms!',
              created_at: '2002-11-19T12:21:54.171Z',
              votes: 0,
            },
          ];
          return request
            .get('/api/articles/5')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.eql(article5);
            });
        });
        it('GET status:200 invalid article number', () => {
          return request
            .get('/api/articles/invalid')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql('Invalid article number');
            });
        });

      });
    });
    describe('/*', () => {
      it('ALL status:404 catches invalid URLs', () => request
        .get('/invalid')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.eql('Route Not Found');
        }));
    });
  });
});
