// src/middlewares/validate.js
const validateAuthorPayload = (req, res, next) => {
  const { name, email } = req.body || {};

  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: { message: 'Field "name" is required' } });
  }
  if (typeof email !== 'string' || email.trim().length === 0) {
    return res.status(400).json({ error: { message: 'Field "email" is required' } });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: { message: 'Field "email" must be a valid email address' } });
  }

  return next();
};

const validatePostPayload = (req, res, next) => {
  const { title, content, author_id } = req.body || {};

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: { message: 'Field "title" is required' } });
  }
  if (typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: { message: 'Field "content" is required' } });
  }
  const authorIdNum = Number(author_id);
  if (!Number.isInteger(authorIdNum) || authorIdNum <= 0) {
    return res.status(400).json({ error: { message: 'Field "author_id" is required and must be a positive integer' } });
  }

  return next();
};

const validateCommentPayload = (req, res, next) => {
  const { post_id, author_id, content } = req.body || {};

  if (!Number.isInteger(Number(post_id)) || Number(post_id) <= 0) {
    return res.status(400).json({ error: { message: 'Field "post_id" is required and must be a positive integer' } });
  }
  if (!Number.isInteger(Number(author_id)) || Number(author_id) <= 0) {
    return res.status(400).json({ error: { message: 'Field "author_id" is required and must be a positive integer' } });
  }
  if (typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: { message: 'Field "content" is required' } });
  }

  return next();
};

module.exports = {
  validateAuthorPayload,
  validatePostPayload,
  validateCommentPayload,
};
