const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Buat koneksi
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Kirim pool ke route
const orgStructureRoutes = require('./routes/orgStructure')(pool);
app.use('/api', orgStructureRoutes);

const authRoutes = require("./routes/auth")(pool);
app.use("/api/auth", authRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
