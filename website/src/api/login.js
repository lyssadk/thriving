// src/api/login.js
const { query } = require('./db');

const handler = async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { username, password } = await req.json();

  try {
    const result = await query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    
    if (result.length === 0) {
      return new Response('Invalid credentials', { status: 401 });
    }
    
    return new Response(JSON.stringify(result[0]), {
      status: 200,
    });
  } catch (error) {
    return new Response('Server Error', { status: 500 });
  }
};

module.exports = { handler };
