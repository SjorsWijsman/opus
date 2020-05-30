'use strict';

const express = require('express');
const formidable = require('formidable');
const mongodb = require('mongodb');

require('dotenv').config();
const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASS;
const dbname = process.env.DB_NAME;

let userName = 'user1';
let userInfo = {};

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://${dbuser}:${dbpassword}@${dbname}.mongodb.net/test?retryWrites=true&w=majority`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

function getUserInfo() {
  MongoClient.connect(uri, options, function(err, client) {
    if (err) throw err;
    const query = { userName: userName };
    client.db('opus').collection('users').find(query).toArray(function(err, result) {
      if (err) throw err;
      userInfo = result[0];
      client.close();
    });
  });
}
getUserInfo();

function setUserInfo(redirect = null) {
  MongoClient.connect(uri, options, function(err, client) {
    if (err) throw err;
    client.db('opus').collection('users').updateOne(
      { userName: userName },
      { $set: userInfo },
      { upsert: true },
      function(err) {
        client.close();
        if (err) throw err;
        if (redirect) redirect;
      },
    );
  });
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('static'));
app.set('view engine', 'ejs');
app.set('views', 'view');

app.listen(port, function() {
  console.log(`Opus app listening at http://localhost:${port}`);
});

app.get(['/', '/homepage', '/index', '/discover'], discover);
app.get('/profile', profile);
app.get('/artwork', artwork);

// Activate Opus Mode
app.post('/profile', function(req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req);
  form.on('field', function(name, field) {
    if (name === 'true') {
      userInfo.opusActive = true;
    } else {
      userInfo.opusActive = false;
    }
  });
  form.on('end', function() {
    console.log(userInfo);
    setUserInfo(profile(req, res));
  });
});

// Receive Artwork Upload
app.post('/artwork', function(req, res) {
  let form = new formidable.IncomingForm();
  let upload = {};
  form.parse(req);
  form.on('field', function(name, field) {
    upload[name] = field;
  });
  form.on('fileBegin', function(name, file) {
    file.name = 'img' + Date.now() + '.' + file.type.split('/')[1];
    file.path = __dirname + '/static/uploads/' + file.name;
    upload[name] = file.name;
  });
  form.on('aborted', function() {
    console.error('Request aborted by the user');
    upload = undefined;
  });
  form.on('error', function(err) {
    console.error('Error', err);
    upload = undefined;
    throw err;
  });
  form.on('end', function() {
    userInfo.artwork = upload;
    setUserInfo();
    console.log('Artwork succesfully updated');
    res.redirect('./profile');
  });
});

// Error functions
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that! (Error code 404)");
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke! (Error code 500)');
});

// Render functions
function discover(req, res) {
  let page = 'discover.ejs';
  let pageTitle = 'Discover';
  res.render(page, {
    title: pageTitle,
    userInfo: userInfo,
  });
}

function profile(req, res) {
  getUserInfo();
  let page = 'profile.ejs';
  let pageTitle = 'Profile';
  res.render(page, {
    title: pageTitle,
    userInfo: userInfo,
  });
}

function artwork(req, res) {
  let page = 'artwork.ejs';
  let msg = 'Input Artwork Image File';
  let error = false;
  res.render(page, {
    msg: msg,
    userInfo: userInfo,
    error: error,
  });
}
