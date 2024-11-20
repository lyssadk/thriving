// bunfig.js
const { defineConfig } = require('bun');

module.exports = defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    {
      name: 'api-plugin',
      setup() {
        return {
          fetch(req) {
            const { pathname } = new URL(req.url);
            if (pathname === '/api/login') {
              return require('./src/api/login.js').handler(req);
            }
            return new Response('Not Found', { status: 404 });
          },
        };
      },
    },
  ],
});
