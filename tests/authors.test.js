const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/config/db');

describe('AUTHORS API (integration with PostgreSQL)', () => {
  beforeAll(async () => {
    await pool.query('TRUNCATE TABLE comments RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE posts RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE authors RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('1) POST success (201)', async () => {
    const res = await request(app).post('/api/authors').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Bio text',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: 'John Doe',
        email: 'john.doe@example.com',
        bio: 'Bio text',
      })
    );
  });

  it('2) POST validation error (400)', async () => {
    const res = await request(app).post('/api/authors').send({
      name: '',
      email: '',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message');
  });

  it('3) GET existing author (200)', async () => {
    const created = await request(app).post('/api/authors').send({
      name: 'Alice',
      email: 'alice@example.com',
      bio: null,
    });

    const authorId = created.body.id;
    expect(authorId).toEqual(expect.any(Number));

    const res = await request(app).get(`/api/authors/${authorId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: authorId,
        email: 'alice@example.com',
      })
    );
  });

  it('4) GET missing author (404)', async () => {
    const res = await request(app).get('/api/authors/99999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message', 'Author not found');
  });

  it('5) PUT success (200)', async () => {
    const created = await request(app).post('/api/authors').send({
      name: 'Updater',
      email: 'updater@example.com',
      bio: 'old',
    });

    const authorId = created.body.id;

    const res = await request(app).put(`/api/authors/${authorId}`).send({
      name: 'Updated Name',
      email: 'updater@example.com',
      bio: 'new bio',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: authorId,
        name: 'Updated Name',
        email: 'updater@example.com',
        bio: 'new bio',
      })
    );
  });

  it('6) PUT invalid body (400)', async () => {
    const created = await request(app).post('/api/authors').send({
      name: 'Bad Update',
      email: 'bad.update@example.com',
      bio: 'bio',
    });

    const authorId = created.body.id;

    const res = await request(app).put(`/api/authors/${authorId}`).send({
      name: '',
      email: 'not-an-email',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message');
  });

  it('7) PUT missing author (404)', async () => {
    const res = await request(app).put('/api/authors/99999999').send({
      name: 'No One',
      email: 'no.one@example.com',
      bio: 'bio',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message', 'Author not found');
  });

  it('8) PUT duplicate email (409)', async () => {
    const a = await request(app).post('/api/authors').send({
      name: 'Author A',
      email: 'author.a@example.com',
      bio: 'bio',
    });
    const b = await request(app).post('/api/authors').send({
      name: 'Author B',
      email: 'author.b@example.com',
      bio: 'bio',
    });

    const res = await request(app).put(`/api/authors/${b.body.id}`).send({
      name: 'Author B updated',
      email: 'author.a@example.com', // duplicate
      bio: 'bio',
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({ error: 'Email already exists' });
  });

  it('9) DELETE success (204)', async () => {
    const created = await request(app).post('/api/authors').send({
      name: 'To Delete',
      email: 'to.delete@example.com',
      bio: 'bio',
    });

    const authorId = created.body.id;

    const delRes = await request(app).delete(`/api/authors/${authorId}`);
    expect(delRes.statusCode).toBe(204);
    expect(delRes.text).toBe('');

    const getRes = await request(app).get(`/api/authors/${authorId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
