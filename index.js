const http = require('http');
const express = require('express')
const app = express()

let path = require('path')

const port = 3000;

let public = '/public/'

// Open listen port
app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`)
});

// app.use(express.static('public'))

// Set EJS as view engine
app.set('view engine', 'ejs');

app.get(['/', '/homepage', '/index'], function (req, res) {
  let page = path.join(__dirname + public + 'homepage')
  let location = "Homepage";
  let list = ["One", "Two", "Three", "Four"];
  res.render(page, {location: location, list: list});
})

app.get('/users', function (req, res) {
  let page = path.join(__dirname + public + 'users');
  let location = "Users";
  let users = ["Dallas", "Chains", "Hoxton", "Wolf"];
  res.render(page, {location: location, users: users});
})

app.get('/video', function (req, res) {
  res.sendFile(path.join(__dirname + public + 'video.mp4'));
})

app.get('/profile/:profileID', function (req, res) {
  res.send(req.params)
})


app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
