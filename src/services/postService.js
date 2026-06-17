// src/services/postService.js
const pool = require('../config/db');

const listPosts = async () => {
  const { rows } = await pool.query(
    `SELECT p.id, p.title, p.content, p.author_id, p.published, p.created_at,
            a.name AS author_name
     FROM posts p
     JOIN authors a ON a.id = p.author_id
     ORDER BY p.created_at DESC`
  );
  return rows;
};

const getPostById = async (postId) => {
  const { rows } = await pool.query(
    `SELECT p.id, p.title, p.content, p.author_id, p.published, p.created_at,
            a.name AS author_name
     FROM posts p
     JOIN authors a ON a.id = p.author_id
     WHERE p.id = $1`,
    [postId]
  );
  return rows.length === 0 ? null : rows[0];
};

const createPost = async ({ title, content, authorId, published }) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO posts (title, content, author_id, published)
       VALUES ($1, $2, $3, COALESCE($4, FALSE))
       RETURNING id, title, content, author_id, published, created_at`,
      [title, content, authorId, published]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }
};

const updatePost = async (postId, { title, content, authorId, published }) => {
  const { rows } = await pool.query(
    `UPDATE posts
     SET title = $1,
         content = $2,
         author_id = $3,
         published = COALESCE($4, published)
     WHERE id = $5
     RETURNING id, title, content, author_id, published, created_at`,
    [title, content, authorId, published, postId]
  );
  return rows.length === 0 ? null : rows[0];
};

const deletePost = async (postId) => {
  const { rows } = await pool.query(
    'DELETE FROM posts WHERE id = $1 RETURNING id',
    [postId]
  );
  return rows.length === 0 ? null : true;
};

const getPostsByAuthor = async (authorId) => {
  const { rows } = await pool.query(
    `SELECT p.id, p.title, p.content, p.author_id, p.published, p.created_at
     FROM posts p
     WHERE p.author_id = $1
     ORDER BY p.created_at DESC`,
    [authorId]
  );
  return rows;
};

module.exports = {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor,
};
