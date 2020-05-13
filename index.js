const http = require('http');
const express = require('express')
const app = express()

let path = require('path')

const port = 3000;

let publicDir = '/public'

// Open listen port
app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`)
});

// Set EJS as view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get(['/', '/homepage', '/index', '/discover'], function (req, res) {
  let page = path.join(__dirname + publicDir + '/discover')

  let pageTitle = "Generic Dating App - Discover";

  let opusActive = false;

  res.render(page, {title: pageTitle, opus: opusActive});
})

app.get(['/discover-opus'], function (req, res) {
  let page = path.join(__dirname + publicDir + '/discover')

  let pageTitle = "Opus - Discover";

  let opusActive = true;

  res.render(page, {title: pageTitle, opus: opusActive});
})

app.get('/profile', function (req, res) {
  let page = path.join(__dirname + publicDir + '/profile')

  let pageTitle = "Generic Dating App - Profile";

  let opusActive = false;

  res.render(page, {title: pageTitle, opus: opusActive});
})

app.get(['/profile-opus'], function (req, res) {
  let page = path.join(__dirname + publicDir + '/profile')

  let pageTitle = "Opus - Profile";

  let opusActive = true;

  res.render(page, {title: pageTitle, opus: opusActive});
})



app.get('/users', function (req, res) {
  let page = path.join(__dirname + publicDir + '/users');
  let location = "Users";

  let users = ["Dallas", "Chains", "Hoxton", "Wolf"];

  res.render(page, {location: location, users: users});
})

app.get('/video', function (req, res) {
  res.sendFile(path.join(__dirname + publicDir + '/resources/video.mp4'));
})

app.get('/profile/:profileID', function (req, res) {
  res.send(req.params)
})



app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that! (Error code 404)")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke! (Error code 500)')
})
