const User = require('../models/user');

exports.getStatus = (req, res) => {
  console.log(req.session);
  const sessionUser = req.session.user;

  const user = sessionUser
    ? {
      _id: sessionUser._id.toString(),
      userName: sessionUser.userName,
      email: sessionUser.email,
      avatarUrl: sessionUser.avatarUrl
    }
    : null;

  res.json({
    isAuthenticated: !!req.session.isLoggedIn,
    user
  });
};

exports.getLogin = (req, res, next) => {
  res.json({ message: "Login route" });
};

exports.postLogin = (req, res, next) => {
  const { username, password } = req.body;

  User.findById('6973e9d3dbfec7a487e5f469')
    .then(userFound => {
      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.session.isLoggedIn = true;
      req.session.user = {
        _id: userFound._id.toString(),
        userName: userFound.userName,
        email: userFound.email,
        avatarUrl: userFound.avatarUrl
      };
      // Here you would typically check the username and password against your database
      // For demonstration, we'll just return a success message
      res.json({ message: "Login successful", username });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logout successful" });
  });
};