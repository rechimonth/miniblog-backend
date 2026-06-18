// src/routes/comments.js
const express = require('express');

const {
  createComment,
  listCommentsByPost,
  deleteComment,
} = require('../services/commentService');

const { validateCommentPayload } = require('../middlewares/validate');

const router = express.Router();

// Required by the project: POST /api/comments
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

// Required by the project: GET /api/comments/post/:postId
router.get('/post/:postId', async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }

    const comments = await listCommentsByPost(postId);
    // Keep 200 behavior (tests expect 200)
    return res.status(200).json(comments);
  } catch (err) {
    return next(err);
  }
});

// Required by the project: DELETE /api/comments/:id
router.delete('/:id', async (req, res, next) => {

  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(404).json({ error: { message: 'Comment not found' } });
    }

    const deleted = await deleteComment(id);
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Comment not found' } });
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

