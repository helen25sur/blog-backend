const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getStatus = (req, res) => {
  console.log(req.user);
  const sessionUser = req.session.user;

  const user = req.user
    ? {
      _id: req.user._id.toString(),
      userName: req.user.userName,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl
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
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then(userFound => {
      if (!userFound) {
        return res.status(404).json({ message: 'User with this email not found' });
      } else {
        bcrypt.compare(password, userFound.password)
          .then(isMatch => {
            if (!isMatch) {
              return res.status(401).json({ message: 'Invalid password' });
            } else {
              req.session.isLoggedIn = true;
              req.session.user = {
                _id: userFound._id.toString(),
                userName: userFound.userName,
                email: userFound.email,
                avatarUrl: userFound.avatarUrl
              };
              res.json({ message: "Login successful", email });
            }
          });
      }
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

exports.getSignup = (req, res, next) => {
  res.json({ message: "Signup route" });
}

exports.postSignup = (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  User.findOne({ email: email })
    .then(userFound => {
      if (userFound) {
        return res.status(400).json({ message: "Email already exists" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const newUser = new User({
        userName: username,
        email: email,
        avatarUrl: 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Wayfarers&hairColor=Brown&facialHairType=Blank&clotheType=CollarSweater&clotheColor=Gray01&eyeType=Side&eyebrowType=SadConcerned&mouthType=Twinkle&skinColor=Pale',
        password: hashedPassword
      });
      return newUser.save();
    })
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = {
        _id: user._id.toString(),
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl
      };
      res.status(201).json({ message: "Signup successful", username, email });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
};
