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

const {generateMessage} = require('./utils/message');

var users = require('../routes/users'); 
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


hbs.registerHelper("showSubname", function(items) {
  let html = "";
  let subtype = 0; 
  items[1].forEach(function(entry) {
    //html += "<p>Next sub-type:</p>"
    subtype++;
    //console.log("entry"+entry[0]);
    entry.forEach(function(entry2) {
      console.log("");
      console.log("");
      console.log("entry2._id="+entry2._id+"'");
      console.log("items[2]="+items[2]+"'");
      if (entry2._id == items[2]) {
      console.log("WE DID THIIIIIIIS");
        
        html += "<label>" + hbs.Utils.escapeExpression(entry2.subname) + " - " + hbs.Utils.escapeExpression(entry2.actionmsg) + "</label><br/><br/>";
        if (entry2.price != null) html += '<label for="dtp_input2" class="col-md-2 control-label">Price:</label>'
        if (entry2.price != null) html += '<div class="input-group spinner col-md-10"><p>'+hbs.Utils.escapeExpression(entry2.price)+'$ per unit</p></div>';
      }
    });
  });

  return new hbs.SafeString(html);
});

hbs.registerHelper("showTables", function(items) {
    //safeItems = hbs.Utils.escapeExpression(items);  
    //console.log('headers='+items);

    html = "<ul>";
    headername = ''; 
    items[0].forEach(function(entry) {
      // escape all entries that will be made by users
      html += "<li>" + hbs.Utils.escapeExpression(entry.name) + "</li>";
      headername = entry.name;
    html += "<table><tbody>";
    //console.log('item 0 subname='+item1[0].subname);
    let subtype = 0; 
    items[1].forEach(function(entry) {
      //html += "<p>Next sub-type:</p>"
      subtype++;
      entry.forEach(function(entry2) {

        //console.log("entry2a="+entry2.parent.name);
        //console.log("entry2b="+headername);
        if (entry2.parent.name === headername) {
          //console.log("entry2="+entry2);
          // escape all entries that will be made by users
          html += "<tr>";
          html += "<td>" + hbs.Utils.escapeExpression(entry2.parent.name) + "</td>";
          html += "<td>" + hbs.Utils.escapeExpression(entry2.infotype) + "</td>";
          html += "<td>" + hbs.Utils.escapeExpression(entry2.subname) + "</td>";
          html += "<td>" + hbs.Utils.escapeExpression(entry2.message) + "</td>";
          if (subtype == 1) html += "<td><a href='/users/bookform/" + hbs.Utils.escapeExpression(entry2._id) + "'>"+hbs.Utils.escapeExpression(entry2.actionmsg)+"</a></td>";
          if (subtype == 2) html += "<td><a href='/users/buyform/" + hbs.Utils.escapeExpression(entry2._id) + "'>"+hbs.Utils.escapeExpression(entry2.actionmsg)+"</a></td>";
          if (subtype == 3) html += "<td><a href='/users/bookform/" + hbs.Utils.escapeExpression(entry2._id) + "'>"+hbs.Utils.escapeExpression(entry2.actionmsg)+"</a></td>";
          //html += "<td><a href=`/booking/${hbs.Utils.escapeExpression(entry2)`>{{bookNow}}</a></td>";
          html += "</tr>";
        }
        //html += "<li>" + hbs.Utils.escapeExpression(entry2) + "</li><br/>";
      });
    });
    html += "</tbody></table>";
     
    
    });
    html += "</ul>";

    return new hbs.SafeString(html);
});

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

//app.use('/lists', lists);
app.use('/admin', admin);
app.use('/users', users);

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

