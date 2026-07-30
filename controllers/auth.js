const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getStatus = (req, res) => {
  res.json({
    isAuthenticated: !!req.session.user
  });
};
// TODO: think about cutting this middleware

exports.getLogin = (req, res, next) => {
  res.json({ message: "Login route" });
};

exports.postLogin = async (req, res, next) => {
  console.log("🔥 POST LOGIN REACHED");
  try {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    req.session.isLoggedIn = true;

    req.session.user = {
      _id: userFound._id.toString(),
      userName: userFound.userName,
      email: userFound.email,
      avatarUrl: userFound.avatarUrl
    };

    res.json({
      message: "Login successful",
      user: {
        _id: userFound._id.toString(),
        userName: userFound.userName,
        email: userFound.email,
        avatarUrl: userFound.avatarUrl
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }
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

exports.getProfile = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  console.log("Fetching profile for user ID:", req.user._id);
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        _id: user._id.toString(),
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        createdAt: user.createdAt || user._id.getTimestamp()
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
};

exports.putProfile = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  User.findByIdAndUpdate(
    req.user._id,
    {
      userName: req.body.userName,
      avatarUrl: req.body.avatarUrl,
      bio: req.body.bio
    },
    { new: true, runValidators: true }
  )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        _id: user._id.toString(),
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      });
      console.log("Profile updated for user ID:", user._id, "New data:", req.body);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
};
