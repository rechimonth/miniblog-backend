// src/services/authorService.js
const pool = require('../config/db');

const listAuthors = async () => {
  const { rows } = await pool.query(
    'SELECT id, name, email, bio, created_at FROM authors ORDER BY created_at DESC'
  );
  return rows;
};

const getAuthorById = async (authorId) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, bio, created_at FROM authors WHERE id = $1',
    [authorId]
  );
  return rows.length === 0 ? null : rows[0];
};

const createAuthor = async ({ name, email, bio }) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO authors (name, email, bio)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, bio, created_at`,
      [name, email, bio ?? null]
    );
    return rows[0];
  } catch (err) {
    // Re-throw for HTTP layer to decide mapping (e.g. unique violation -> 400)
    throw err;
  }
};

const updateAuthor = async (authorId, { name, email, bio }) => {
  const { rows } = await pool.query(
    `UPDATE authors
     SET name = $1, email = $2, bio = $3
     WHERE id = $4
     RETURNING id, name, email, bio, created_at`,
    [name, email, bio ?? null, authorId]
  );
  return rows.length === 0 ? null : rows[0];
};

const deleteAuthor = async (authorId) => {
  const { rows } = await pool.query(
    'DELETE FROM authors WHERE id = $1 RETURNING id',
    [authorId]
  );
  return rows.length === 0 ? null : true;
};

module.exports = {
  listAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
