exports.getLogin = (req, res, next) => {
  res.json({ message: "Login route" });
};

exports.postLogin = (req, res, next) => {
  const { username, password } = req.body;
  req.session.isLoggedIn = true;
  // Here you would typically check the username and password against your database
  // For demonstration, we'll just return a success message
  res.json({ message: "Login successful", username });
}