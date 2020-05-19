const http = require('http');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const opus = {
  active: true,
  artwork: undefined
}

app.use(urlencodedParser);
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
app.post('/artwork', urlencodedParser, function (req, res) {
  console.log(req.body.artform)
  upload(req, res, (err) => {
    if (err) {
      res.render('artwork.ejs', {
        error: true,
        msg: err
      });
    } else {
      res.render('artwork.ejs', {
        error: false,
        msg: "Artwork succesfully updated!"
      });
    }
  })
})

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that! (Error code 404)")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke! (Error code 500)')
})



const storage = multer.diskStorage({
  destination: './static/uploads/',
  filename: function(req, file, callback){
    // const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    const fileName = "upload.png"
    callback(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000},
  fileFilter: function(req, file, callback){
    checkFileType(file, callback)
  }
}).single('artwork');

function checkFileType(file, callback) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname.toLowerCase()));
  const mimetype = filetypes.test(file.mimetype)
  if (extname && mimetype){
    return callback(null, true)
  } else {
    callback('Error: Images Only!')
  }
}



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
  res.render(page, {msg: msg, error: error})
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
