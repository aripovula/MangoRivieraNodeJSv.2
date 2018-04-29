require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');
const moment = require('moment');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const {generateMessage} = require('./utils/message');

var lists = require('../routes/lists'); 
var admin = require('../routes/admin');

const port = process.env.PORT || 3001;

var app = express();

var server = http.createServer(app);
var io = socketIO(server); 

console.log("API = "+process.env.WEATHERAPIKEY); 

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/MangoRivDB';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// PART TO CUSTOM SAVE TO DB
// var HeaderType = require('../models/headertype');

// var bt = new HeaderType(
//   { name: "bt2 yes, shukur" }
// );

// bt.save(function (err) {
//   if (err) { return next(err); }
// });

// END OF PART TO CUSTOM SAVE TO DB

// START OF CUSTOM READ PART

// HeaderType.find()
// .sort([['name', 'ascending']])
// .exec(function (err, list_headertypes) {
//   var theheadertypes = list_headertypes;

//   //console.log('in controLLER 22 = '+list_headertypes +list_headertypes.name );
//   console.log('in 22 1='+theheadertypes[0].name);
//   console.log('in 22 1='+theheadertypes[6].name);

// });

// END OF CUSTOM READ PART

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/MangoRivDB";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
  
//   var dbo = db.db("MangoRivDB");
//   dbo.createCollection("headertype", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//   });
//   var myobj = { name: "fitness trainer" };
//   dbo.collection("headertype").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//   });

//   db.close();
// });


hbs.registerPartials(path.join(__dirname , '../views/partials'))
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname , '../public')));

// set sessions and cookie parser
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET, 
  cookie: { maxAge: 60000 },
  resave: true,    // forces the session to be saved back to the store
  saveUninitialized: true  // dont save unmodified
}));
app.use(flash());

app.use('/lists', lists);
app.use('/admin', admin);

io.on('connection',(socket) => {
  console.log('New user connected');
  console.log(__dirname);

  // to emit to one user - MYSELF
  socket.emit('newMessage', generateMessage('Guest services', 'Hey, we wish you a lot of fun! Enjoy it !'));

  // to emit broadcast message TO ALL EXcluding MYSELF by sending default message
  socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

  // var x2;
  var x = 0;
  console.log('new x = '+x);
  // if ( x2 == null || x2 != "true" ) {
  var intervalID = setInterval(function () {

      // x2 = true;
      console.log('SENT IT x = '+x);
      // Your logic here
      io.sockets.emit('newShoutMessage', generateMessage('Admin',`New BOY joined = ${x}`));

      if (++x === 8) {
          clearInterval(intervalID);
          // x2 = false;
      }
    }, 4000);
  // }

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage',message);

    // to emit broadcast message TO ALL INcluding MYSELF
    io.emit('newMessage',generateMessage(message.from, message.text));
    callback('from SERVER');

    // to emit broadcast message TO ALL EXcluding MYSELF by capturing sent message
    // socket.broadcast.emit('newMessage',{
    //     from: message.from,
    //     text: message.text,
    //     createdAt: new Date().getTime()
    //   });

  });  

  socket.on('createShoutMessage', (message, callback) => {

    io.emit('newShoutMessage',generateMessage("", message.text));
    callback(`from Shouter m = ${message.text} from: ${message.from}  @ ${message.createdAt}`);
  });  

  socket.on('disconnect', () => {
    console.log('User is disconnected');
  });  

});

app.get('/home', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Enjoy our resort more with this app - accurate statistics, bookings, schedules, requests and more'
  });
});

app.get('/admin', (req, res) => {
  res.render('/adminpage.hbs', {
    pageTitle: 'Admin Page',
    welcomeMessage: 'A page that in real life would require an admin password'
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

server.listen(port, () => {
  var createdAt = moment().format('h:mm a');
  console.log(`Server is up on port ${port} - started at ${createdAt}`);
});

