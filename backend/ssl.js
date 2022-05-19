const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

app.get('/.well-known/pki-validation/105316848030DA5F240358399594428D.txt', (req, res) => {
    const file = __dirname + '/105316848030DA5F240358399594428D.txt';
    res.download(file);
});

server.listen(80, () => {
    console.log('Server is running on port 80');
});
