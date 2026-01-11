const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let posts = [
  { id: 1, title: "Мій перший пост", content: "Привіт, блог!" }
];

const postsRouter = require('./routes/posts');

app.use(postsRouter);


app.listen(3000, () => console.log("Server running on port 3000"));
