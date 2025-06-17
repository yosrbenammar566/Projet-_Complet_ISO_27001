const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.listen(5000, 'localhost', () => {
  console.log('Server REALLY running on http://localhost:5000');
});

// Gestion explicite des erreurs
server.on('error', (err) => {
  console.error('SERVER ERROR:', err.code);
  if (err.code === 'EADDRINUSE') {
    console.log('Port 5000 already in use');
  }
});