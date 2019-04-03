process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.use(require('chai-sorted'));

const { expect } = chai;
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
              'author',
              'title',
              'article_id',
              'topic',
              'created_at',
              'votes',
            ));
          });
      });
      it('GET status:200 returns each article with a comment count', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].comment_count).to.equal('13');
            articles.forEach(article => expect(article).to.contain.keys('comment_count'));
          });
      });
      describe('/articles?queries', () => {
        it('GET status:200 accepts author queries', () => {
          return request
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.lengthOf(3);
              articles.forEach(article => expect(article.author).to.eql('butter_bridge'));
            });
        });
        it('GET status:200 accepts topic queries', () => {
          return request
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.lengthOf(11);
              articles.forEach(article => expect(article.topic).to.eql('mitch'));
            });
        });
        it('GET status:200 accepts sort_by queries', () => {
          return request
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('author', { descending: true });
            });
        });
        it('GET status:200 accepts sort order', () => {
          return request
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('created_at', { descending: false });
            });
        });
        it('GET status:200 defaults to date sort_by, descending', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('created_at', { descending: true });
            });
        });
        it('GET status:200 ignores invalid query column', () => {
          return request
            .get('/api/articles?invalid=butter_bridge')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('created_at', { descending: true });
            });
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
              created_at: '2002-11-19T12:21:54.171Z',
              votes: 0,
              comment_count: '2',
            },
          ];
          return request
            .get('/api/articles/5')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.eql(article5);
            });
        });
        it('GET status:404 non-existent article number', () => {
          return request
            .get('/api/articles/100')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql('Article does not exist');
            });
        });
        it('GET status:400 NaN article number', () => {
          return request
            .get('/api/articles/invalid')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql('Invalid article number');
            });
        });
        it('PATCH status:200 amends a specific article', () => {
          const ballotBox = { inc_votes: 100 };
          return request
            .patch('/api/articles/5')
            .send(ballotBox)
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article[0].votes).to.eql(100);
            });
        });
        it('PATCH status:200 adds to the votes count', () => {
          const ballotBox = { inc_votes: 100 };
          return request
            .patch('/api/articles/1')
            .send(ballotBox)
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article[0].votes).to.eql(200);
            });
        });
        it('PATCH status:404 non-existent article number', () => {
          const ballotBox = { inc_votes: 100 };
          return request
            .patch('/api/articles/100')
            .send(ballotBox)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql('Article does not exist');
            });
        });
        it('PATCH status:400 NaN article number', () => {
          const ballotBox = { inc_votes: 100 };
          return request
            .patch('/api/articles/invalid')
            .send(ballotBox)
            .expect(400)
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
