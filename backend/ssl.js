const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

app.get('/.well-known/pki-validation/C4986DA0C7047C5EFEEA1FA9CEA4BFC6.txt', (req, res) => {
    const file = __dirname + '/C4986DA0C7047C5EFEEA1FA9CEA4BFC6.txt';
    res.download(file);
});

server.listen(80, () => {
    console.log('Server is running on port 80');
});
