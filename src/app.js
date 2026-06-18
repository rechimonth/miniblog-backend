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

// Safety: convert unhandled errors to 500 ordered response
app.use((err, req, res, next) => errorHandler(err, req, res, next));

module.exports = app;

