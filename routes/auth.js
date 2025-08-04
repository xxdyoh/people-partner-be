const express = require("express");
const bcrypt = require("bcrypt");

module.exports = (pool) => {
  const router = express.Router();

  // Register
  router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (password.length < 8) return res.status(400).json({ message: "Password minimal 8 karakter" });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
        [username, hashedPassword]
      );

      res.status(201).json({ message: "User berhasil didaftarkan", userId: result.rows[0].id });
    } catch (err) {
      if (err.code === "23505") {
        res.status(409).json({ message: "Username sudah digunakan" });
      } else {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan server" });
      }
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = result.rows[0];
      if (!user) return res.status(401).json({ message: "Username tidak ditemukan" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Password salah" });

      res.json({ message: "Login sukses", user: { id: user.id, username: user.username } });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};