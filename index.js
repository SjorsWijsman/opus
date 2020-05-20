const http = require('http');
const express = require('express');
const path = require('path');
const formidable = require('formidable')

const app = express();
const port = process.env.PORT || 3000;

const opus = {
  active: false,
  artwork: undefined
}

app.use(express.static('static'));
app.set('view engine', 'ejs');
app.set('views', 'view');

app.listen(port, function () {
  console.log(`Opus app listening at http://localhost:${port}`)
});

app.get(['/', '/homepage', '/index', '/discover'], discover)
app.get('/profile', profile)
app.get('/artwork', artwork)

// Activate Opus
app.post('/profile', function (req, res) {
  opus.active = !opus.active;
  profile(req, res)
})

// Receive Artwork upload
app.post('/artwork', function (req, res) {
  let form = new formidable.IncomingForm();
  opus.artwork = {};
  form.parse(req);
  form.on('field', (name, field) => {
    opus.artwork[name] = field;
  })
  form.on('fileBegin', (name, file) => {
    opus.artwork[name] = file.name;
    // file.path = __dirname + '/static/uploads/' + file.name;
    file.path = __dirname + '/static/uploads/' + Date.now();
  })
  form.on('aborted', () => {
    console.error('Request aborted by the user');
    opus.artwork = undefined;
  })
  form.on('error', (err) => {
    console.error('Error', err);
    opus.artwork = undefined;
    throw err
  })
  form.on('end', () => {
    console.log('Artwork succesfully updated')
    res.redirect('./profile')
  })
})

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that! (Error code 404)")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke! (Error code 500)')
})



function discover(req, res) {
  let page = 'discover.ejs'
  let pageTitle = "Discover";
  res.render(page, {title: pageTitle, opus: opus});
}

function profile(req, res) {
  let page = 'profile.ejs'
  let pageTitle = "Profile";
  res.render(page, {title: pageTitle, opus: opus});
}

function artwork(req, res) {
  let page = 'artwork.ejs';
  let msg = "Input Artwork Image File";
  let error = false;
  res.render(page, {msg: msg, opus: opus, error: error})
}



// app.get('/users', function (req, res) {
//   let page = path.join(__dirname + publicDir + '/users');
//   let location = "Users";
//
//   let users = ["Dallas", "Chains", "Hoxton", "Wolf"];
//
//   res.render(page, {location: location, users: users});
// })
//
// app.get('/video', function (req, res) {
//   res.sendFile(path.join(__dirname + publicDir + '/resources/video.mp4'));
// })
//
// app.get('/profile/:profileID', function (req, res) {
//   res.send(req.params)
// })
