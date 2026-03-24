const https = require('https');

const data = JSON.stringify({
  name: "Test",
  email: "test@example.com",
  message: "test message"
});

const req = https.request('https://gb-backend-sosf.onrender.com/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
});

req.on('error', console.error);
req.write(data);
req.end();
