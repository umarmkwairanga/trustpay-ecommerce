const http = import('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Working');
});

server.listen(5000, '0.0.0.0', () => {
  console.log('Server running on 5000');
});
