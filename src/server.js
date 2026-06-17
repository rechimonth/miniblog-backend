// src/server.js
require('dotenv').config();

const app = require('./app');

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`MiniBlog API listening on port ${PORT}`);
});
