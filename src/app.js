const express = require('express');

const authorsRoutes = require('./routes/authors');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

const errorHandler = require('./middlewares/errorHandler');

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

app.use(express.json());

// ---- Swagger /api-docs ----
// Carga el YAML desde el filesystem (ruta absoluta segura)
const openapiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openapiDocument = YAML.load(openapiPath);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiDocument)
);

app.use('/api/authors', authorsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);

// Global error handler must be registered last
app.use(errorHandler);

module.exports = app;

