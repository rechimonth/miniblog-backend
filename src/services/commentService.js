// src/services/commentService.js
const pool = require('../config/db');

const createComment = async ({ postId, authorId, content }) => {
  const { rows } = await pool.query(
    `INSERT INTO comments (post_id, author_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, post_id, author_id, content, created_at`,
    [postId, authorId, content]
  );
  return rows[0];
};

const listCommentsByPost = async (postId) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.post_id, c.author_id, c.content, c.created_at, a.name AS author_name
     FROM comments c
     JOIN authors a ON a.id = c.author_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return rows;
};

const deleteComment = async (commentId) => {
  const { rows } = await pool.query(
    'DELETE FROM comments WHERE id = $1 RETURNING id',
    [commentId]
  );
  return rows.length === 0 ? null : true;
};

module.exports = {
  createComment,
  listCommentsByPost,
  deleteComment,
};

