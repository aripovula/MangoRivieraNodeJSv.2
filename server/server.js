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


const All_Chats = require('../models/all_chats');
const All_Shouts = require('../models/all_shouts');
const User = require('../models/user');
const Users_Booking = require('../models/users_booking');
const Users_Buy = require('../models/users_buy');

const auth = require('../routes/auth');
const users = require('../routes/users');
const admin = require('../routes/admin');

const port = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);
const io = socketIO(server); 

let bookingIDs2simulate = [];
let buyIDs2simulate = [];
let evenTime = false;
let thepercentage = [];
let onlyleft = [];
let xco = 0;
let errorOnly = "";
simulateTableInfo();
sendBroadcastMessageEvery10secs();

//console.log("API = "+process.env.WEATHERAPIKEY); 

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/MangoRivDB';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// PART TO CUSTOM SAVE TO DB
// let  HeaderType = require('../models/headertype');

// let  bt = new HeaderType(
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
//   let  theheadertypes = list_headertypes;

//   //console.log('in controLLER 22 = '+list_headertypes +list_headertypes.name );
//   console.log('in 22 1='+theheadertypes[0].name);
//   console.log('in 22 1='+theheadertypes[6].name);

// });

// END OF CUSTOM READ PART

// let  MongoClient = require('mongodb').MongoClient;
// let  url = "mongodb://localhost:27017/MangoRivDB";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
  
//   let  dbo = db.db("MangoRivDB");
//   dbo.createCollection("headertype", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//   });
//   let  myobj = { name: "fitness trainer" };
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

  //console.log('bookingIDs2simulate = '+bookingIDs2simulate.length + '  buyIDs2simulate = '+buyIDs2simulate.length);
  //console.log('bookingIDs2simulate = '+bookingIDs2simulate + '  buyIDs2simulate = '+buyIDs2simulate);

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

////
// app.use(cookieParser('secret'));
// app.use(session({
//     cookie: { maxAge: 60000 },
//     store: sessionStore,
//     saveUninitialized: true,
//     resave: 'true',
//     secret: 'secret'
// }));
// app.use(flash());

////

//app.use('/lists', lists);

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

  // to emit to one user - MYSELF
  //socket.emit('newMessage', generateMessage4admin('--Guest services', 'Hey, we wish you a lot of fun! Enjoy it !'));

  // to emit broadcast message TO ALL EXcluding MYSELF by sending default message
  //socket.broadcast.emit('newMessage', generateMessage4admin('--Admin','New user joined'));

  // let  x2;
  //xco = 0;
  //console.log('new x = '+x);
  // if ( x2 == null || x2 != "true" ) {
  //let  intervalID = setInterval(function () {

      // x2 = true;
      //console.log('SENT IT x = '+x);
      // Your logic here
      //io.sockets.emit('newShoutMessage', generateMessage4admin('Admin',`New BOY joined = ${xco}`,1));

      // if (++xco >= 8) {
      //     clearInterval(intervalID);
      //     // x2 = false;
      // }
    //}, 10000);
  // }


  socket.on('createMessage', (message, callback) => {
    //console.log('createMessage',message);

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
      //console.log("ANDdata="+data);
      io.emit('topicMessages', data);
    });

    // to emit broadcast message TO ALL INcluding MYSELF
    // let  topicMessages = generateTopicMessages(intGr);
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

    //console.log('IN readTopicChats');
    All_Chats
    .find({ 'intGr': intGr.intGr })
    //.find()
    .sort([['dateTime', 'ascending']])
    .exec(function (err, data){
      if (err) console.log('IN readTopicChats ERROR');
      //console.log('IN readTopicChats data.len = '+data.length);
      //console.log('IN readTopicChats data Str = '+stringify(data));
      return callback(data);
    });
   }

/////////

socket.on('readShoutMessages', (callback) => {

  console.log('IN READ SHOUT METHOD');
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

////////
   
   socket.on('checkSessionStatus', (callback) => {

    checkIfSessionIsActive(function (data){
      io.emit('SessionStatusBack', data);
    });
  });  

   function checkIfSessionIsActive(callback){
    User.findById(req.session.userId)
    .exec(function (error, user) {
  
      if (error) {
        callback(false);
      } else {
        if (user === null) {
          callback(false);
        } else {
          callback(true);
        }
      }
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

function sendBroadcastMessageEvery10secs() {
  //let  myPromise = updateWeatherInfo(apiKey);
  xco++;
  if (xco >= 8) xco = 0;
  let message = generateShoutMessage(xco);
  io.sockets.emit('newShoutMessage', message);
  setTimeout(sendBroadcastMessageEvery10secs, 10*1000);
}

function simulateTableInfo() {
  //console.log('Simulator = '+bookingIDs2simulate.length);

  for (let  i = 0, len = bookingIDs2simulate.length; i < len; i++) {
    
    // IF LIVE REAL DATA EXISTED I WOULD GET PERCENTAGE DATA AS FOLLOWS
    
    let bookingID = bookingIDs2simulate[i];
    let d = new Date();
    let anHourAgo = d - 1000 * 60 * 60;
    let anHourLater = d + 1000 * 60 * 60;

    let capacity = 80; 
    let currentUsers = Users_Booking.find({ bookingID: bookingID, dateTime: {$gt: anHourAgo}, dateTime: {$lt: anHourLater}}, function(err) {});
    let currentUsage = currentUsers.length;
    let percentOccupied = currentUsage / capacity;

    // TO SIMULATE DATA FOLLOWING IS USED
    let percentageChange = Math.floor(Math.random()*(2-1+1)+1);
    
    if (thepercentage[i] == null) thepercentage[i] = Math.floor(Math.random()*(80-60+1)+60);
    if (Math.floor(Math.random()*(2-1+1)+1) == 1) thepercentage[i] = thepercentage[i] - percentageChange; else thepercentage[i] = thepercentage[i] + percentageChange;
    if (thepercentage[i] < 40) thepercentage[i] = 40;
    if (thepercentage[i] > 90) thepercentage[i] = 90;
    let msg = thepercentage[i]+"% occupied";
  
    io.emit('data4table',{id:bookingID, msg:msg, evenTime:evenTime});
    //console.log('Simulator = '+bookingID+" x="+counter);
  }

  for (let  i = 0, len = buyIDs2simulate.length; i < len; i++) {
    let buyID = buyIDs2simulate[i];
    let change = Math.floor(Math.random()*(2-1+1)+1);
    if (onlyleft[i] == null) onlyleft[i] = Math.floor(Math.random()*(70-50+1)+50);
    onlyleft[i] = onlyleft[i] - change;
    if (onlyleft[i] < 1) onlyleft[i] = Math.floor(Math.random()*(70-50+1)+50);
    let msg = onlyleft[i]+" tickets left";
  
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

app.get('/restoredefaults', (req, res) => {
  console.log('IN IN FIIIRST restoredefaults');
  return RestoreDefaultDataInMongoDB()
  .then(() => {
    console.log('IN IN THEEEN');
    res.redirect('/users/home');
  });
});

// app.get('/users/home', (req, res) => {
//   res.redirect('/users/home');
// });

// app.get('/admin', (req, res) => {
//   res.render('/adminpage.hbs', {
//     pageTitle: 'Admin Page',
//     welcomeMessage: 'A page that in real life would require an admin password'
//   });
// });

// app.get('/datepick/:bookingID', (req, res) => {
//   res.render('datepick.hbs', {
//     bookingID: req.params.bookingID,
//     pageTitle: 'Admin Page',
//     welcomeMessage: 'A page that in real life would require an admin password'
//   });
// });

app.get('/error', (req, res) => {
  res.render('error.hbs',{
    error: errorOnly
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
// app.get('/bad', (req, res) => {
//   res.send({
//     errorMessage: 'Unable to handle request'
//   });
// });

// error handler 
app.use(function (err, req, res, next) {
  console.error(err.stack);
  errorOnly = err;
  //res.status(500).send('Something went wrong!'+err);
  res.redirect('/error');
});


// let  Forecast = require('forecast.io-bluebird');

// let  forecast = new Forecast({
//   key: process.env.WEATHERAPIKEY,
//   timeout: 9500
// });

// forecast.fetch(41.299968, 69.2707328)
// .then(function(result) {
//     console.dir("WEATHER="+result);
// })
// .catch(function(error) {
//     console.error("ERRRROR "+error);
// });


server.listen(port, () => {
  let  createdAt = moment().format('h:mm a');
  console.log(`Server is up on port ${port} - started at ${createdAt}`);
});