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
const stringify = require('json-stringify');
const MongoStore = require('connect-mongo')(session);

const {generateMessage} = require('./utils/message');
const {generateMessage4admin} = require('./utils/message4admin');
const {deleteOldChatsEveryDay} = require('./utils/chatDeleteScheduler');
deleteOldChatsEveryDay();
const {constructTable}  = require('./utils/constructTable');

const {getSubname}  = require('./utils/getSubname');


const All_Chats = require('../models/all_chats');
const User = require('../models/user');

const users = require('../routes/users');
const admin = require('../routes/admin');

const port = process.env.PORT || 3001;

var app = express();

var server = http.createServer(app);
var io = socketIO(server); 

var bookingIDs2simulate = [];
var buyIDs2simulate = [];
var evenTime = false;
var thepercentage = [];
var onlyleft = [];
simulateTableInfo();

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


hbs.registerHelper("showSubname", function(items) {
  
  let html = getSubname(items);

  return new hbs.SafeString(html);
});

hbs.registerHelper("showTables", function(items) {

  let package = constructTable(items);
  let html = package.view;
  bookingIDs2simulate = package.bookingIDs;
  buyIDs2simulate = package.buyIDs;

  console.log('bookingIDs2simulate = '+bookingIDs2simulate.length + '  buyIDs2simulate = '+buyIDs2simulate.length);
  console.log('bookingIDs2simulate = '+bookingIDs2simulate + '  buyIDs2simulate = '+buyIDs2simulate);

  return new hbs.SafeString(html);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname , '../public')));

// set sessions and cookie parser
//app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET, 
  cookie: { maxAge: 60 * 60 * 1000 },
  resave: true,    // forces the session to be saved back to the store
  saveUninitialized: false,  // dont save unmodified
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(flash());

//app.use('/lists', lists);
app.use('/admin', admin);
app.use('/users', users);

app.use(function (req, res, next) {
  console.log('SSSSS Time:', Date.now());
  User.findById(req.session.userId)
  .exec(function (error, user) {

    if (error) {
      console.log('ERROR 1');
      res.redirect('/users/homelocked');
    } else {
      if (user === null) {
        console.log('USER NULL');
        res.redirect('/users/homelocked');      
      } else {
        // console.log('user2 = ' + user.roomCode);
        // req.session.room_code = user.roomCode;
        // console.log('user3 = ' + req.session.room_code); 
        next();
      }
    }
  });
});


io.on('connection',(socket) => {
  console.log('New user connected');
  console.log(__dirname);

  // to emit to one user - MYSELF
  //socket.emit('newMessage', generateMessage4admin('--Guest services', 'Hey, we wish you a lot of fun! Enjoy it !'));

  // to emit broadcast message TO ALL EXcluding MYSELF by sending default message
  //socket.broadcast.emit('newMessage', generateMessage4admin('--Admin','New user joined'));

  // var x2;
  var x = 0;
  console.log('new x = '+x);
  // if ( x2 == null || x2 != "true" ) {
  var intervalID = setInterval(function () {

      // x2 = true;
      console.log('SENT IT x = '+x);
      // Your logic here
      io.sockets.emit('newShoutMessage', generateMessage4admin('Admin',`New BOY joined = ${x}`,1));

      if (++x === 8) {
          clearInterval(intervalID);
          // x2 = false;
      }
    }, 4000);
  // }

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage',message);

    // to emit broadcast message TO ALL INcluding MYSELF
    io.emit('newMessage',generateMessage(message.from, message.text, message.intGr));
    callback('from SERVER');

    // to emit broadcast message TO ALL EXcluding MYSELF by capturing sent message
    // socket.broadcast.emit('newMessage',{
    //     from: message.from,
    //     text: message.text,
    //     createdAt: new Date().getTime()
    //   });

  });  

  socket.on('readTopicMessages', (intGr, callback) => {
    //console.log('createMessage',message);

    readTopicChats(intGr, function (data){
      console.log("ANDdata="+data);
      io.emit('topicMessages', data);
    });

    // to emit broadcast message TO ALL INcluding MYSELF
    // var topicMessages = generateTopicMessages(intGr);
    // console.log("topicMessages in server ="+stringify(topicMessages));
    // io.emit('topicMessages', topicMessages);
    //callback('from DB_Reader = '+data  );

    // to emit broadcast message TO ALL EXcluding MYSELF by capturing sent message
    // socket.broadcast.emit('newMessage',{
    //     from: message.from,
    //     text: message.text,
    //     createdAt: new Date().getTime()
    //   });
  });  

  function readTopicChats (intGr, callback){

    All_Chats
    .find({ 'intGr': intGr.intGr })
    //.find()
    .sort([['dateTime', 'ascending']])
    .exec(function (err, data){
      return callback(data);
    });
   }

  socket.on('createShoutMessage', (message, callback) => {

    io.emit('newShoutMessage',generateMessage4admin("", message.text, 1));
    callback(`from Shouter m = ${message.text} from: ${message.from}  @ ${message.createdAt}`);
  });


  socket.on('disconnect', () => {
    console.log('User is disconnected');
  });  

});

function simulateTableInfo() {
  //console.log('Simulator = '+bookingIDs2simulate.length);

  for (var i = 0, len = bookingIDs2simulate.length; i < len; i++) {
    let bookingID = bookingIDs2simulate[i];
    let percentageChange = Math.floor(Math.random()*(2-1+1)+1);
    
    if (thepercentage[i] == null) thepercentage[i] = Math.floor(Math.random()*(80-60+1)+60);
    if (Math.floor(Math.random()*(2-1+1)+1) == 1) thepercentage[i] = thepercentage[i] - percentageChange; else thepercentage[i] = thepercentage[i] + percentageChange;
    if (thepercentage[i] < 40) thepercentage[i] = 40;
    if (thepercentage[i] > 90) thepercentage[i] = 90;
    let msg = thepercentage[i]+"% occupied";
  
    io.emit('data4table',{id:bookingID, msg:msg, evenTime:evenTime});
    //console.log('Simulator = '+bookingID+" x="+counter);
  }

  for (var i = 0, len = buyIDs2simulate.length; i < len; i++) {
    let buyID = buyIDs2simulate[i];
    let change = Math.floor(Math.random()*(2-1+1)+1);
    if (onlyleft[i] == null) onlyleft[i] = Math.floor(Math.random()*(70-50+1)+50);
    onlyleft[i] = onlyleft[i] - change;
    if (onlyleft[i] < 1) onlyleft[i] = Math.floor(Math.random()*(70-50+1)+50);
    let msg = "only "+onlyleft[i]+" tickets left";
  
    io.emit('data4table',{id:buyID, msg:msg, evenTime:evenTime});
    //console.log('Simulator = '+bookingID+" x="+counter);
  }
  evenTime = !evenTime;
  setTimeout(simulateTableInfo, 5*1000); // for demo purposes updates every minute
}


app.get('/', (req, res) => {
  res.redirect('/users/home');
});

app.get('/home', (req, res) => {
  res.redirect('/users/home');
});

app.get('/users/home', (req, res) => {
  res.redirect('/users/home');
});

app.get('/admin', (req, res) => {
  res.render('/adminpage.hbs', {
    pageTitle: 'Admin Page',
    welcomeMessage: 'A page that in real life would require an admin password'
  });
});

app.get('/datepick/:bookingID', (req, res) => {
  res.render('datepick.hbs', {
    bookingID: req.params.bookingID,
    pageTitle: 'Admin Page',
    welcomeMessage: 'A page that in real life would require an admin password'
  });
});


// app.get('/bookform/:userID', (req, res) => {
//   res.render('bookform.hbs', {
//     id: req.params.userID,
//     pageTitle: 'Book Page',
//     welcomeMessage: 'A page that in real life would require an admin password'
//   });
// });

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