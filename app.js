const express = require('express');
const cors = require('cors');

const mongoConnect = require('./db/database').mongoConnect;

const app = express();
app.use(cors());
app.use(express.json());

const postsRouter = require('./routes/posts');

app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use(postsRouter);

mongoConnect(() => {
  app.listen(3000, () => console.log("Server running on port 3000"));
});
