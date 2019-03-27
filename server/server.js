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
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const stringify = require('json-stringify');
const MongoStore = require('connect-mongo')(session);

// util functions
const {generateMessage} = require('./utils/message');
const {generateMessage4admin} = require('./utils/message4admin');
const {generateShoutMessage} = require('./utils/shoutMessage');
const {deleteOldChatsEveryWeek} = require('./utils/chatDeleteScheduler');
deleteOldChatsEveryWeek();
const {deleteOldShoutsEveryMinute} = require('./utils/shoutDeleteScheduler');
deleteOldShoutsEveryMinute();
const {constructTable}  = require('./utils/constructTable');
const {RestoreDefaultDataInMongoDB} = require('./utils/restoreDefaultsInMongoDB');
const {scheduleRestoreDefaults} = require('./utils/scheduleRestoreDefaults');
scheduleRestoreDefaults();
const {getSubname}  = require('./utils/getSubname');
const {simulateTableInfo} = require('./utils/simulateTableInfo');
const {sendBackForecastTable} = require('./utils/scheduleWeatherUpdate');

// models used
const All_Chats = require('../models/all_chats');
const All_Shouts = require('../models/all_shouts');
const User = require('../models/user');
const Users_Booking = require('../models/users_booking');
const Users_Buy = require('../models/users_buy');

// all routes
const auth = require('../routes/auth');
const users = require('../routes/users');
const admin = require('../routes/admin');

const port = process.env.PORT;

const app = express();

const server = http.createServer(app);
const io = socketIO(server); 

let bookingIDs2simulate = [];
let buyIDs2simulate = [];
let evenTime = false;
let xco = 0;
let errorOnly = "";
let weatherData;
scheduleWeatherUpdate();
simulateInfo4table();
sendBroadcastMessageEvery10secs();

//console.log("API = "+process.env.WEATHERAPIKEY); 

//Set up default mongoose connection
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

hbs.registerPartials(path.join(__dirname , '../views/partials'))
app.set('view engine', 'hbs');

// Helper to get value to pages
hbs.registerHelper("showSubname", function(items) {
  let html = getSubname(items);
  return new hbs.SafeString(html);
});

// Helper to construct dashboard table
hbs.registerHelper("showTables", function(items) {

  let package = constructTable(items);
  let html = package.view;
  bookingIDs2simulate = package.bookingIDs;
  buyIDs2simulate = package.buyIDs;
  return new hbs.SafeString(html);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname , '../public')));

// set sessions and cookie parser
app.use(cookieParser(process.env.SECRET));
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

app.use('/admin', admin);
app.use('/users', users);

app.use(function (req, res, next) {
  console.log('SSSSS Time:', Date.now());
  console.log('req.session.userId:', req.session.userId);
  User.findById(req.session.userId)
  .exec(function (error, user) {

    console.log('USER:', user );
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
        console.log('SESSION ID = ' + req.sessionID); 
        next();
      }
    }
  });
});

io.on('connection',(socket) => {
  console.log('New user connected');
  console.log(__dirname);

  socket.on('createMessage', (message, callback) => {
    // to emit broadcast message TO ALL INcluding MYSELF
    io.emit('newMessage',generateMessage(message.from, message.text, message.intGr));
    callback('from SERVER');
  });  

  socket.on('readTopicMessages', (intGr, callback) => {
    readTopicChats(intGr, function (data){
      io.emit('topicMessages', data);
    });
  });  

  function readTopicChats (intGr, callback){
    All_Chats
    .find({ 'intGr': intGr.intGr })
    .sort([['dateTime', 'ascending']])
    .exec(function (err, data){
      if (err) console.log('IN readTopicChats ERROR');
      return callback(data);
    });
   }

  socket.on('readShoutMessages', (callback) => {
    readShouts(function (data){
      io.emit('shoutMessages', data);
    });
  });

  function readShouts (callback){
    All_Shouts
    .find({})
    .sort([['dateTime', 'ascending']])
    .exec(function (err, data){
      return callback(data);
    });
  }

  socket.on('createShoutMessage', (message, callback) => {
    io.emit('newShoutMessage',generateMessage4admin("", message.text, 1));
    callback(`from Shouter m = ${message.text} from: ${message.from}  @ ${message.createdAt}`);
  });

  socket.on('requestWeatherData', () => {
    if (weatherData != null) {
      io.emit('weatherData',weatherData);
    } else {
      scheduleWeatherUpdate();
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User is disconnected');
  });  

});
// END OF SOCKET.IO BLOCK

function sendBroadcastMessageEvery10secs() {
  xco++;
  if (xco >= 8) xco = 0;
  let message = generateShoutMessage(xco);
  io.sockets.emit('newShoutMessage', message);
  setTimeout(sendBroadcastMessageEvery10secs, 10*1000);
}

function simulateInfo4table() {
  if (bookingIDs2simulate != null && buyIDs2simulate != null) {
    let result = simulateTableInfo(evenTime, bookingIDs2simulate, buyIDs2simulate);
    io.emit('data4table',result);
    evenTime = !evenTime;
  }
  setTimeout(simulateInfo4table, 5*1000); // for demo purposes updated every 5 seconds
}

function scheduleWeatherUpdate() {
  setTimeout(scheduleWeatherUpdate, 1 * 60 * 1000);
  let  html = '<div class="boxed">... updating weather info ...</div> ';
  io.emit('weatherData', html);
  //console.log("IN FORECAST REQUEST SERVER = "+new Date);
  return sendBackForecastTable()
  .then((data) => {
    //console.log('SERVER detailed='+data.detailed);
    weatherData = data;
    io.emit('weatherData', data);
  });
}

app.get('/', (req, res) => {
  res.redirect('/users/home');
});

app.get('/home', (req, res) => {
  res.redirect('/users/home');
});

app.get('/restoredefaults', (req, res) => {
  console.log('IN IN FIIIRST restoredefaults');
  return RestoreDefaultDataInMongoDB()
  .then(() => {
    console.log('IN IN THEEEN');
    res.redirect('/users/home');
  });
});

app.get('/error', (req, res) => {
  res.render('error.hbs',{
    error: errorOnly
  });
});

// error handler 
app.use(function (err, req, res, next) {
  console.error(err.stack);
  errorOnly = err;
  res.redirect('/error');
});


server.listen(port, () => {
  let  createdAt = moment().format('h:mm a');
  console.log(`Server is up on port ${port} - started at ${createdAt}`);
});