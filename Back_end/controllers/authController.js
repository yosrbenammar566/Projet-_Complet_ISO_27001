const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationCode } = require('../utils/sendEmail');

// 🔐 POST - Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "devsecret", {
      expiresIn: "1d",
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).send("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = new User({
    username,
    email,
    passwordHash: hashed,
    role: role || "user",
    verificationCode: code,
    verificationCodeExpires: expires
  });

  await user.save();
  await sendVerificationCode(email, code);

  res.status(201).send("Verification code sent to email.");
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("User not found");

  const isExpired = user.verificationCodeExpires < new Date();
  if (isExpired) return res.status(400).send("Code expired");

  if (user.verificationCode !== code)
    return res.status(400).send("Invalid code");

  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;
  await user.save();

  res.send("Email verified successfully.");
};