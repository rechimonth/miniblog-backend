// src/routes/comments.js
const express = require('express');

const {
  createComment,
  listCommentsByPost,
} = require('../services/commentService');

const { validateCommentPayload } = require('../middlewares/validate');

const router = express.Router();

// Extra Credit: Comments associated to posts/authors
// POST /api/comments
router.post('/', validateCommentPayload, async (req, res, next) => {
  try {
    const { post_id, author_id, content } = req.body;
    const created = await createComment({
      postId: Number(post_id),
      authorId: Number(author_id),
      content,
    });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

// GET /api/comments/post/:postId
router.get('/post/:postId', async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }
    const comments = await listCommentsByPost(postId);
    return res.status(200).json(comments);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
