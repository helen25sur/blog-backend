// TODO: write middleware in async/await style

const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');

// const resend = new Resend(process.env.RESEND_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array().map(err => err.msg)
    });
  }

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

    req.session.save(err => {
      if (err) {
        return res.status(500).json({
          message: "Session save failed"
        });
      }

      res.json({
        message: "Login successful",
        user: {
          _id: userFound._id.toString(),
          userName: userFound.userName,
          email: userFound.email,
          avatarUrl: userFound.avatarUrl
        }
      });
    });



  } catch (err) {
    console.error(err.message);
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

exports.postSignup = async (req, res) => {

  const errors = validationResult(req);
  const err = errors.errors;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array().map(err => err.msg)
    });
  }


  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName: username,
      email: normalizedEmail,
      avatarUrl:
        "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Wayfarers&hairColor=Brown&facialHairType=Blank&clotheType=CollarSweater&clotheColor=Gray01&eyeType=Side&eyebrowType=SadConcerned&mouthType=Twinkle&skinColor=Pale",
      password: hashedPassword
    });

    const user = await newUser.save();

    req.session.isLoggedIn = true;
    req.session.user = {
      _id: user._id.toString(),
      userName: user.userName,
      email: user.email,
      avatarUrl: user.avatarUrl
    };

    req.session.save(err => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Session save failed"
        });
      }

      res.status(201).json({
        message: "Signup successful",
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          avatarUrl: user.avatarUrl
        }
      });
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Signup is successful",
      html: `<h1>Welcome!</h1>
              <p>${user.userName}, nice to see you in our community!</p>
              <p>We hope, you\'ll be satisfied!</p>`
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message
    });
  }
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

exports.getResetPassword = (req, res, next) => {
  res.json({ message: "Reset password route" });
};

exports.postResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error generating token" });
      }
      const token = buffer.toString('hex');
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "No user found with that email" });
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset your password",
        html: `<h1>Reset your password</h1>
              <p>${user.userName}, you have requested to reset your password.</p>
              <p>Please click the link below to reset your password:</p>
              <a href="${process.env.FRONTEND_URL}/reset/${token}">Reset Password</a>`
      });
      res.json({ message: "Password reset email sent" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    res.json({ message: "Token is valid", userId: user._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.postNewPassword = async (req, res, next) => {
  const { token, password, confirmPassword } = req.body;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};