const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/db');

describe('POSTS API (integration with PostgreSQL)', () => {
  beforeAll(async () => {
    await pool.query('TRUNCATE TABLE comments RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE posts RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE authors RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('1) POST success (201)', async () => {
    const authorRes = await request(app).post('/api/authors').send({
      name: 'Post Author',
      email: 'post.author@example.com',
      bio: 'bio',
    });

    expect(authorRes.statusCode).toBe(201);
    const authorId = authorRes.body.id;

    const postRes = await request(app).post('/api/posts').send({
      title: 'My Post',
      content: 'Some content',
      author_id: authorId,
      published: true,
    });

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: 'My Post',
        content: 'Some content',
        author_id: authorId,
      })
    );
  });

  it('2) POST validation error (400)', async () => {
    const authorRes = await request(app).post('/api/authors').send({
      name: 'Post Author 2',
      email: 'post.author2@example.com',
      bio: 'bio',
    });
    const authorId = authorRes.body.id;

    const postRes = await request(app).post('/api/posts').send({
      title: '',
      content: '',
      author_id: authorId,
    });

    expect(postRes.statusCode).toBe(400);
    expect(postRes.body).toHaveProperty('error');
    expect(postRes.body.error).toHaveProperty('message');
  });

  it('3) GET existing post (200)', async () => {
    const authorRes = await request(app).post('/api/authors').send({
      name: 'Getter',
      email: 'getter@example.com',
      bio: 'bio',
    });
    const authorId = authorRes.body.id;

    const postRes = await request(app).post('/api/posts').send({
      title: 'Existing Post',
      content: 'content',
      author_id: authorId,
      published: false,
    });

    const postId = postRes.body.id;

    const getRes = await request(app).get(`/api/posts/${postId}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toEqual(expect.objectContaining({ id: postId, title: 'Existing Post' }));
  });

  it('4) GET missing post (404)', async () => {
    const res = await request(app).get('/api/posts/99999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message', 'Post not found');
  });

  it('5) PUT success (200)', async () => {
    const authorRes = await request(app).post('/api/authors').send({
      name: 'Putter',
      email: 'putter@example.com',
      bio: 'bio',
    });
    const authorId = authorRes.body.id;

    const postRes = await request(app).post('/api/posts').send({
      title: 'Old title',
      content: 'Old content',
      author_id: authorId,
      published: false,
    });
    const postId = postRes.body.id;

    const res = await request(app).put(`/api/posts/${postId}`).send({
      title: 'New title',
      content: 'New content',
      author_id: authorId,
      published: true,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: postId,
        title: 'New title',
        content: 'New content',
        author_id: authorId,
      })
    );
  });

  it('6) PUT validation error (400)', async () => {
    const authorRes = await request(app).post('/api/authors').send({
      name: 'Invalid put',
      email: 'invalid.put@example.com',
      bio: 'bio',
    });
    const authorId = authorRes.body.id;

    const postRes = await request(app).post('/api/posts').send({
      title: 'title',
      content: 'content',
      author_id: authorId,
      published: false,
    });
    const postId = postRes.body.id;

    const res = await request(app).put(`/api/posts/${postId}`).send({
      title: '',
      content: '',
      author_id: authorId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message');
  });

  it('7) PUT missing post (404)', async () => {
    const authorRes = await request(app).post('/api/authors').send({
      name: 'Missing post author',
      email: 'missing.post.author@example.com',
      bio: 'bio',
    });
    const authorId = authorRes.body.id;

    const res = await request(app)
      .put('/api/posts/99999999')
      .send({
        title: 'No post',
        content: 'content',
        author_id: authorId,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message', 'Post not found');
  });

  it('8) DELETE success (204)', async () => {
    const authorRes = await request(app).post('/api/authors').send({
      name: 'Deleter',
      email: 'deleter@example.com',
      bio: 'bio',
    });
    const authorId = authorRes.body.id;

    const postRes = await request(app).post('/api/posts').send({
      title: 'To delete',
      content: 'x',
      author_id: authorId,
      published: false,
    });
    const postId = postRes.body.id;

    const delRes = await request(app).delete(`/api/posts/${postId}`);
    expect(delRes.statusCode).toBe(204);
    expect(delRes.text).toBe('');

    const getRes = await request(app).get(`/api/posts/${postId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
