const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

app.get('/.well-known/pki-validation/F21FCDACE6A9563FCE3B1F424C8F3E7F.txt', (req, res) => {
    const file = __dirname + '/F21FCDACE6A9563FCE3B1F424C8F3E7F.txt';
    res.download(file);
});

server.listen(80, () => {
    console.log('Server is running on port 80');
});
