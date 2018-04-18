const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');
const moment = require('moment');
const http = require('http');
var mongoose = require('mongoose');


const {generateMessage} = require('./utils/message');
var lists = require('../routes/lists'); // Import routes for "catalog" area of site

const port = process.env.PORT || 3001;
var app = express();
var server = http.createServer(app);
var io = socketIO(server); 


//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/MangoRivDB';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var BookingType = require('../models/bookingtype');

var bt = new BookingType(
  { name: "bt2 yes, shukur" }
);

bt.save(function (err) {
  if (err) { return next(err); }
  // Genre saved. Redirect to genre detail page.
  //res.redirect(genre.url);
});

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/MangoRivDB";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
  
//   var dbo = db.db("MangoRivDB");
//   dbo.createCollection("bookingtype", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//   });
//   var myobj = { name: "fitness trainer" };
//   dbo.collection("bookingtype").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//   });

//   db.close();
// });


hbs.registerPartials(path.join(__dirname , '../views/partials'))
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname , '../public')));
app.use('/lists', lists);

io.on('connection',(socket) => {
  console.log('New user connected');
  console.log(__dirname);

  // to emit to one user - MYSELF
  socket.emit('newMessage', generateMessage('Guest services', 'Hey, we wish you a lot of fun! Enjoy it !'));

  // to emit broadcast message TO ALL EXcluding MYSELF by sending default message
  socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

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
