// src/app.js
const express = require('express');

const authorsRoutes = require('./routes/authors');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/authors', authorsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);

// Global error handler must be registered last
app.use(errorHandler);

module.exports = app;


