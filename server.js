const http = require('http');
const fs = require('fs');
const path = require('path');

// Server configuration
const PORT = 3000;

// Create the server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Gather user information
    const userInfo = {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      method: req.method,
      url: req.url,
      headers: JSON.stringify(req.headers, null, 2), // Convert headers to JSON string
    };

    // Serve an HTML response with dynamic content
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading file');
        return;
      }

      // Replace placeholders in the HTML with userInfo data
      const html = data
        .replace('${userInfo.ip}', userInfo.ip)
        .replace('${userInfo.userAgent}', userInfo.userAgent)
        .replace('${userInfo.method}', userInfo.method)
        .replace('${userInfo.url}', userInfo.url)
        .replace('${userInfo.headers}', userInfo.headers);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  } else {
    // Serve static files or handle 404 errors
    const filePath = path.join(__dirname, 'public', req.url + '.html');
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(filePath));
    } else {
      // Handle 404 errors
      const notFoundPath = path.join(__dirname, 'public', '404.html');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(notFoundPath));
    }
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
