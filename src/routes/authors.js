// src/routes/authors.js
const express = require('express');

const {
  listAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../services/authorService');

const { validateAuthorPayload } = require('../middlewares/validate');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const authors = await listAuthors();
    return res.status(200).json(authors);
  } catch (err) {
    return next(err);
  }
});

router.get('/:authorId', async (req, res, next) => {
  try {
    const authorId = Number(req.params.authorId);
    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(404).json({ error: { message: 'Author not found' } });
    }

    const author = await getAuthorById(authorId);
    if (!author) {
      return res.status(404).json({ error: { message: 'Author not found' } });
    }
    return res.status(200).json(author);
  } catch (err) {
    return next(err);
  }
});

router.post('/', validateAuthorPayload, async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    const created = await createAuthor({ name, email, bio });
    return res.status(201).json(created);
  } catch (err) {
    // Unique email constraint could be mapped by code here; keep simple.
    return next(err);
  }
});

router.put('/:authorId', validateAuthorPayload, async (req, res, next) => {
  try {
    const authorId = Number(req.params.authorId);
    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(404).json({ error: { message: 'Author not found' } });
    }

    const { name, email, bio } = req.body;
    const updated = await updateAuthor(authorId, { name, email, bio });
    if (!updated) {
      return res.status(404).json({ error: { message: 'Author not found' } });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:authorId', async (req, res, next) => {
  try {
    const authorId = Number(req.params.authorId);
    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(404).json({ error: { message: 'Author not found' } });
    }

    const deleted = await deleteAuthor(authorId);
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Author not found' } });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
