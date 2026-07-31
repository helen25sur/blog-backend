require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { csrfSync } = require("csrf-sync");

// const mongoConnect = require('./db/database').mongoConnect;

const User = require('./models/user');
const postsControllers = require('./controllers/posts');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USER_PASSWORD}@cluster0.uwu6dns.mongodb.net/blog`

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// app.use(cors());
app.use(express.json());

const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    // Якщо деплоїте на Render (HTTPS), додайте ці параметри:
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

const { csrfSynchronisedProtection, generateToken } = csrfSync();

app.use((req, res, next) => {
  if (!req.session.user) {
    return next(); // гість — просто йдемо далі без req.user
  }

  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

app.use('/favicon.ico', express.static('public/favicon.ico'));
app.get("/csrf-token", (req, res) => {
  res.json({
    csrfToken: generateToken(req)
  });
});

app.use(csrfSynchronisedProtection);
app.use(authRouter);
app.use('/posts', postsRouter);
app.use('/', postsControllers.getAllPosts); // Додано маршрут для отримання всіх постів на кореневому шляху
app.use((req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      message: 'Invalid CSRF token'
    });
  }

  next(err);
});

mongoose.connect(MONGODB_URI + "?retryWrites=true&w=majority")
  .then(result => {
    console.log("Connected to DB:", mongoose.connection.name);
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch(err => {
    console.error(err);
  })
