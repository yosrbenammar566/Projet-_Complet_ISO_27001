const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ Enregistrement d’un nouvel utilisateur
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Vérifie si un utilisateur avec cet email existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Création du nouvel utilisateur avec hachage automatique via mongoose pre('save')
    const newUser = new User({
      username,
      email,
      passwordHash: password,
      role: role || 'user'
    });

    await newUser.save();

    res.status(201).json({
      message: "Utilisateur enregistré avec succès.",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ Connexion d’un utilisateur
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Recherche par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "1d" }
    );

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
