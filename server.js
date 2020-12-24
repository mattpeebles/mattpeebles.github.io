const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const port = 3260;

app.use(express.static("./dist"))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

var server = http.createServer(app)

server.listen(port, function () {
    console.log('Web server listening on port ' + port)
  })