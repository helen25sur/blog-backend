require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// const mongoConnect = require('./db/database').mongoConnect;

const User = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());

const postsRouter = require('./routes/posts');

app.use((req, res, next) => {
  User.findById('6973e9d3dbfec7a487e5f469')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.error(err);
    })
})

app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use(postsRouter);

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USER_PASSWORD}@cluster0.uwu6dns.mongodb.net/blog?retryWrites=true&w=majority`)
  .then(result => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch(err => {
    console.error(err);
  })
