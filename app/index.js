const http = require('http');
const express = require('express')
const app = express()

let path = require('path')

const port = 3000;


app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.use(express.static('public'))


app.get(['/', '/homepage', '/index'], function (req, res) {
  res.sendFile(path.join(__dirname + '/public/' + 'homepage.html'));
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/' + 'about.html'));
})

app.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/' + 'contact.html'));
})


app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
