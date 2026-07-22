const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.json({ message: "Login route" });
};

exports.postLogin = (req, res, next) => {
  const { username, password } = req.body;

  User.findById('6973e9d3dbfec7a487e5f469')
    .then(user => {
      if (user) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        // Here you would typically check the username and password against your database
        // For demonstration, we'll just return a success message
        res.json({ message: "Login successful", username });
      }

    })
    .catch(err => {
      console.error(err);
    })
}

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