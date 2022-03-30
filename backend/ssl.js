const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

app.get('/.well-known/pki-validation/88C532DBA25A68B0C193E6CBFC41A79C.txt', (req, res) => {
    const file = __dirname + '/88C532DBA25A68B0C193E6CBFC41A79C.txt';
    res.download(file);
});

server.listen(80, () => {
    console.log('Server is running on port 80');
});
