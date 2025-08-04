const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/org-structure', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM baseorgstructure');
      res.json(result.rows);
    } catch (err) {
      console.error('Query error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
