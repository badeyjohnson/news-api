module.exports = {
  '/api': {
    description: 'returns this helpful list of available endpoints',
    methods: 'GET',
  },
  '/api/topics': {
    description: 'returns a list of all article topics',
    methods: 'GET',
  },
  '/api/articles': {
    description: 'returns a overview of all articles',
    methods: 'GET',
    queries: 'author, title, article_id, topic, votes, comment_count, created_at',
    sorted_by: 'author, title, article_id, topic, votes, comment_count, created_at',
    order: 'descending (desc) default, or ascending (asc)',
  },
  '/api/articles/:article_id': {
    description: 'returns the article requested',
    methods: 'GET, PATCH, DELETE',
    queries: 'author, title, article_id, body, topic, votes, comment_count, created_at',
    sorted_by: 'author, title, article_id, body, topic, votes, comment_count, created_at',
    order: 'descending (desc) default, or ascending (asc)',
    patch: 'increment votes up or down, send: { inc_votes: <number> }',
    delete: 'will delete the article',
  },
  '/api/articles/:article_id/comments': {
    description: 'returns the comments for a specific article',
    methods: 'GET, POST',
    sorted_by: 'author, body, votes, comment_id, created_at',
    order: 'descending (desc) default, or ascending (asc)',
    post: 'adds a new commment, send: { username: <username>, body: <comment text>}',
  },
  '/api/comments/:comment_id': {
    description: 'returns the comment requested',
    methods: 'PATCH, DELETE',
    patch: 'increment votes up or down, send: { inc_votes: <number>}',
    delete: 'will delete the comment',
  },
  '/api/users/:username': {
    description: 'returns the user requested',
    methods: 'GET',
  },
};
