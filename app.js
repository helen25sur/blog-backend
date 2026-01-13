const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const postsRouter = require('./routes/posts');

app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use(postsRouter);


app.listen(3000, () => console.log("Server running on port 3000"));
