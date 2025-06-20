const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "auditeur", "responsable", "user"], default: "user" },
  verificationCode: String,
  verificationCodeExpires: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
