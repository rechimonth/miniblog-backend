// src/routes/posts.js
const express = require('express');

const {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor,
} = require('../services/postService');

const { validatePostPayload } = require('../middlewares/validate');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await listPosts();
    return res.status(200).json(posts);
  } catch (err) {
    return next(err);
  }
});

// MUST be declared before `/:postId` to avoid route collision.
router.get('/author/:authorId', async (req, res, next) => {
  try {
    const authorId = Number(req.params.authorId);
    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(404).json({ error: { message: 'Posts not found' } });
    }

    const posts = await getPostsByAuthor(authorId);
    return res.status(200).json(posts);
  } catch (err) {
    return next(err);
  }
});

router.get('/:postId', async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }

    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }
    return res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
});

router.post('/', validatePostPayload, async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;
    const created = await createPost({
      title,
      content,
      authorId: Number(author_id),
      published,
    });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

router.put('/:postId', validatePostPayload, async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }

    const { title, content, author_id, published } = req.body;
    const updated = await updatePost(postId, {
      title,
      content,
      authorId: Number(author_id),
      published,
    });

    if (!updated) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:postId', async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }

    const deleted = await deletePost(postId);
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
