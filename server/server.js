const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');
const moment = require('moment');
const http = require('http');
// const jqueryDatetimepicker = require("jquery-datetimepicker")

const {generateMessage} = require('./utils/message');


const port = process.env.PORT || 3001;
var app = express();
var server = http.createServer(app);
var io = socketIO(server); 

hbs.registerPartials(path.join(__dirname , '../views/partials'))
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname , '../public')));

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
