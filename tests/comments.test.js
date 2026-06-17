const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/db');

describe('COMMENTS API (extra credit, integration with PostgreSQL)', () => {
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
      name: 'Comment Author',
      email: 'comment.author@example.com',
      bio: 'bio',
    });
    expect(authorRes.statusCode).toBe(201);
    const authorId = authorRes.body.id;

    const postRes = await request(app).post('/api/posts').send({
      title: 'Comment Post',
      content: 'content',
      author_id: authorId,
      published: false,
    });
    expect(postRes.statusCode).toBe(201);
    const postId = postRes.body.id;

    const commentRes = await request(app).post('/api/comments').send({
      post_id: postId,
      author_id: authorId,
      content: 'Nice post!',
    });

    expect(commentRes.statusCode).toBe(201);
    expect(commentRes.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        post_id: postId,
        author_id: authorId,
        content: 'Nice post!',
      })
    );
  });

  it('2) POST validation error (400)', async () => {
    const authorRes = await request(app).post('/api/authors').send({
      name: 'Validation Comment Author',
      email: 'validation.comment.author@example.com',
      bio: 'bio',
    });
    const authorId = authorRes.body.id;

    const postRes = await request(app).post('/api/posts').send({
      title: 'Validation Comment Post',
      content: 'content',
      author_id: authorId,
      published: false,
    });
    const postId = postRes.body.id;

    const res = await request(app).post('/api/comments').send({
      post_id: postId,
      author_id: authorId,
      content: '',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message');
  });

  it('3) GET comments by post (200)', async () => {
    const authorRes = await request(app).post('/api/authors').send({
      name: 'Getter Comment Author',
      email: 'getter.comment.author@example.com',
      bio: 'bio',
    });
    const authorId = authorRes.body.id;

    const postRes = await request(app).post('/api/posts').send({
      title: 'Getter Comment Post',
      content: 'content',
      author_id: authorId,
      published: false,
    });
    const postId = postRes.body.id;

    await request(app).post('/api/comments').send({
      post_id: postId,
      author_id: authorId,
      content: 'First comment',
    });

    const listRes = await request(app).get(`/api/comments/post/${postId}`);
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);
    expect(listRes.body[0]).toEqual(
      expect.objectContaining({
        post_id: postId,
        author_id: authorId,
        content: expect.any(String),
      })
    );
  });
});
