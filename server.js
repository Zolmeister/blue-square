'use strict';

// Static assets
var express = require('express')
var app = express()

app.get('/manifest.webapp', function(req, res) {
  res.header('Content-Type', 'application/x-web-app-manifest+json')
  res.sendfile(__dirname + '/manifest.webapp')
})

app.get('/ping', function (req, res) {
  res.end('pong')
})

app.use(express['static'](__dirname + '/src'))


app.listen(process.env.PORT || 3000)
console.log('Listening on port', process.env.PORT || 3000)


// fb-flo - for live reload
var flo = require('fb-flo'),
    fs = require('fs')

flo(
  './src/',
  {
    port: 8888,
    host: 'localhost',
    verbose: false,
    glob: [
      '*.js'
    ]
  },
  function resolver(filepath, callback) {
    callback({
      resourceURL: filepath,
      contents: fs.readFileSync('./src/' + filepath, 'utf-8').toString()
    })
  }
)
