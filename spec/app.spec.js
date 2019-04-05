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
      it('OTHER status:405 methods not allowed', () => {
        const promises = ['post', 'put', 'patch', 'delete'].map((method) => {
          return request[method]('/api/topics')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(promises);
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
      it('OTHER status:405 invalid method', () => {
        const promises = ['post', 'put', 'patch', 'delete'].map((method) => {
          return request[method]('/api/articles')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(promises);
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
        it('GET status:200 ignores invalid query', () => {
          return request
            .get('/api/articles?topic=invalid')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.lengthOf(0);
            });
        });
        it('GET status:200 ignores incorrect sort_by query', () => {
          return request
            .get('/api/articles?sort_by=invalid')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('created_at', { descending: true });
            });
        });
        it('GET status:200 ignores incorrect order query', () => {
          return request
            .get('/api/articles?order=invalid')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('created_at', { descending: true });
            });
        });
      });
      describe('/articles/:article_id', () => {
        it('GET status:200 returns the requested article', () => {
          const article5 = {
            author: 'rogersop',
            title: 'UNCOVERED: catspiracy to bring down democracy',
            article_id: 5,
            topic: 'cats',
            body: 'Bastet walks amongst us, and the cats are taking arms!',
            created_at: '2002-11-19T12:21:54.171Z',
            votes: 0,
            comment_count: '2',
          };
          return request
            .get('/api/articles/5')
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.eql(article5);
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
        it('PATCH status:200 no body responds with unmodified article', () => {
          const ballotBox = { };
          return request
            .patch('/api/articles/5')
            .send(ballotBox)
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article[0].votes).to.eql(0);
            });
        });
        it('DELETE status:204 deletes specified article with no response', () => {
          return request
            .delete('/api/articles/3')
            .expect(204)
            .then(() => {
              return request
                .get('/api/articles/3')
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.eql('Article does not exist');
                });
            });
        });
        it('DELETE status:204 deletes article and related comments', () => {
          return request
            .delete('/api/articles/1')
            .expect(204)
        });
        it('DELETE status:404 non-existent article number', () => {
          return request
            .delete('/api/articles/300')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("Article already doesn't exist");
            });
        });
        it('DELETE status:400 invalid article number', () => {
          return request
            .delete('/api/articles/invalid')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql('Invalid article number');
            });
        });
        it('OTHER status:405 invalid method', () => {
          const promises = ['post', 'put'].map((method) => {
            return request[method]('/api/articles/1')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Method not allowed');
              });
          });
          return Promise.all(promises);
        });
        describe('/articles/:articles_id/comments', () => {
          it('GET status:200 gets comments for a specified article', () => {
            return request
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.lengthOf(13);
                comments.forEach((comment) => {
                  expect(comment).to.contain.keys(
                    'author',
                    'comment_id',
                    'created_at',
                    'votes',
                    'body',
                  );
                });
              });
          });
          it('GET status:200 default sort order and sort_by', () => {
            return request
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.sortedBy('created_at', { descending: true });
              });
          });
          it('GET status:404 non-existent article number', () => {
            return request
              .get('/api/articles/100/comments')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql('Article does not exist');
              });
          });
          it('GET status:400 NaN article number', () => {
            return request
              .get('/api/articles/invalid/comments')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql('Invalid article number');
              });
          });
          it('POST status:201 comment added to an article reponds with posted comment', () => {
            return request
              .post('/api/articles/1/comments')
              .send({ username: 'icellusedkars', body: 'a new comment' })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment[0]).to.contain.keys(
                  'created_by',
                  'body',
                  'comment_id',
                  'created_at',
                  'votes',
                  'article_id',
                );
                expect(comment[0].created_by).to.eql('icellusedkars');
                expect(comment[0].body).to.eql('a new comment');
              });
          });
          it('POST status:403 username does not exist', () => {
            return request
              .post('/api/articles/1/comments')
              .send({ username: 'notValid', body: 'a new comment' })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql('Article or user not found');
              });
          });
          it('POST status:404 non-existent article number', () => {
            return request
              .post('/api/articles/100/comments')
              .send({ username: 'icellusedkars', body: 'a new comment' })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql('Article or user not found');
              });
          });
          it('POST status:400 NaN article number', () => {
            return request
              .post('/api/articles/invalid/comments')
              .send({ username: 'icellusedkars', body: 'a new comment' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql('Invalid article number');
              });
          });
          it('POST status:400 username field not provided', () => {
            return request
              .post('/api/articles/1/comments')
              .send({ body: 'a new comment' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql('Incomplete comment');
              });
          });
          it('POST status:400 body field not provided', () => {
            return request
              .post('/api/articles/1/comments')
              .send({ username: 'icellusedkars' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql('Incomplete comment');
              });
          });
          it('POST status:201 additional fields ignored', () => {
            return request
              .post('/api/articles/1/comments')
              .send({ username: 'icellusedkars', body: 'another comment', extra: 'unneccesary' })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment[0]).to.not.contain.keys('extra');
                expect(comment[0].created_by).to.eql('icellusedkars');
                expect(comment[0].body).to.eql('another comment');
              });
          });
          it('OTHER status:405 invalid requests dealt with', () => {
            const promises = ['put', 'patch', 'delete'].map((method) => {
              return request[method]('/api/articles/1/comments')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Method not allowed');
                });
            });
            return Promise.all(promises);
          });
          describe('/articles/:articles_id/comments?queries', () => {
            it('GET status:200 accepts sort by queries', () => {
              return request
                .get('/api/articles/1/comments?sort_by=author')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy('author', { descending: true });
                });
            });
            it('GET status:200 accepts sort order queries', () => {
              return request
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy('created_at', { descending: false });
                });
            });
            it('GET status:200 ignores incorrect sort_by query', () => {
              return request
                .get('/api/articles/1/comments?sort_by=invalid')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy('created_at', { descending: true });
                });
            });
            it('GET status:200 ignores incorrect order query', () => {
              return request
                .get('/api/articles/1/comments?order=invalid')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy('created_at', { descending: true });
                });
            });
          });
        });
      });
    });
    describe('/comments/:comment_id', () => {
      it('PATCH status:200 increases a comment votes', () => {
        const ballotBox = { inc_votes: 100 };
        return request
          .patch('/api/comments/5')
          .send(ballotBox)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment[0].votes).to.eql(100);
          });
      });
      it('PATCH status:200 decreases a comment votes', () => {
        const ballotBox = { inc_votes: -100 };
        return request
          .patch('/api/comments/5')
          .send(ballotBox)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment[0].votes).to.eql(-100);
          });
      });
      it('PATCH status:404 non-existent article number', () => {
        const ballotBox = { inc_votes: 100 };
        return request
          .patch('/api/comments/1000')
          .send(ballotBox)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql('Comment does not exist');
          });
      });
      it('PATCH status:400 NaN article number', () => {
        const ballotBox = { inc_votes: 100 };
        return request
          .patch('/api/comments/invalid')
          .send(ballotBox)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql('Invalid request');
          });
      });
      it('PATCH status:400 inc_votes NaN', () => {
        const ballotBox = { inc_votes: 'up' };
        return request
          .patch('/api/comments/1')
          .send(ballotBox)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql('Invalid request');
          });
      });
      it('PATCH status:200 ignores empty body', () => {
        const ballotBox = { };
        return request
          .patch('/api/comments/5')
          .send(ballotBox)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment[0].votes).to.eql(0);
          });
      });
      it('DELETE status:204 deletes specified comment with no response', () => {
        return request.delete('/api/comments/3').expect(204);
      });
      it('DELETE status:404 non-existent comment number', () => {
        return request
          .delete('/api/comments/300')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Comment already doesn't exist");
          });
      });
      it('DELETE status:400 invalid comment number', () => {
        return request
          .delete('/api/comments/invalid')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql('Invalid comment number');
          });
      });
      it('OTHER status:405 invalid method', () => {
        const promises = ['get', 'post', 'put'].map((method) => {
          return request[method]('/api/comments/1')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(promises);
      });
    });
    describe('/users/:username', () => {
      it('GET status:200 returns the specified user', () => {
        const usr = [
          {
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          },
        ];
        return request
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.eql(usr);
          });
      });
      it('GET status:404 non-existent username', () => {
        return request
          .get('/api/users/100')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql('User does not exist');
          });
      });
      it('OTHER status:405 invalid method', () => {
        const promises = ['delete', 'post', 'put'].map((method) => {
          return request[method]('/api/users/butter_bridge')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(promises);
      });
    });
    describe('/api', () => {
      it('GET status:200 returns a handy guide', () => {
        return request
          .get('/api')
          .expect(200)
          .then(({ body: { endpoints } }) => {
            expect(endpoints).to.contain.keys(
              '/api',
              '/api/topics',
              '/api/articles',
              '/api/articles/:article_id',
              '/api/articles/:article_id/comments',
              '/api/comments/:comment_id',
              '/api/users/:username',
            );
          });
      });
    });
    describe('/*', () => {
      it('ALL status:404 catches invalid URLs', () => request
        .get('/invalid')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.eql('Route not found');
        }));
    });
  });
});
