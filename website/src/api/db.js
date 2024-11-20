// src/api/db.js
const { Pool } = require('pg');

// Get the database URL from environment variables (use Vercel's DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,  // Vercel sets this environment variable automatically
  ssl: {
    rejectUnauthorized: false, // Vercel requires SSL connections
  },
});

const query = async (text, params) => {
  const res = await pool.query(text, params);
  return res.rows;
};

module.exports = { query };
