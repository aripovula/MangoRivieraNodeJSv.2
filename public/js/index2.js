// $(document).ready(function () {
//   pausein5sec();
// });

var socket = io();
var htmlPrev="";

socket.on('connect', function() {
  console.log('Connected to server at ');
});

socket.on('disconnect', function() {
  console.log('Disconnected to server');
});

socket.on('newShoutMessage',function(message){

  //var timePosted = moment().format('h:mm a');
  //console.log("it works SHOUT: "+message.text + " timePosted = "+message.createdAt);

  var chatData = [{from:message.from, createdAt:message.createdAt, text:message.text }];
   var theTemplateScript = $("#shout-template").html(); 
   if (theTemplateScript != null) {
      var theTemplate = Handlebars.compile(theTemplateScript);
      var html = theTemplate(chatData);
      $("#shoutboard").html(html+htmlPrev); 
      //  $("#shoutboard2").html(html+htmlPrev); 
      htmlPrev = html + htmlPrev;
   }
});

socket.on('newMessage',function(message){

  var timePosted = moment().format('h:mm a');
  //console.log("it works: "+message.text + " timePosted = "+timePosted);
  // var html = `<p><span style="color:red">${message.from}}</span> - <span style="color:gray">@ ${timePosted}} </span> : <span style="color:green"> ${message.text}} </span></p>`;
  // var html = `<p>${message.from} @ ${timePosted}: ${message.text}</p>`;
  // jQuery('#messages').append(html);

  var chatData = [{from:message.from, timePosted:timePosted, text:message.text }];
  var theTemplateScript = $("#chat-template").html(); 
   if (theTemplateScript != null) {
      var theTemplate = Handlebars.compile(theTemplateScript); 
      //  console.log("data = " + chatData[0].from);
      //  console.log("data = " + chatData[0].text);
      //  console.log("html = " + theTemplate(chatData));
      $("#messages").append(theTemplate(chatData)); 

      jQuery('[name=message]').val('');
  }
});


// window.addEventListener('submit', function(evt) {
  //   evt.preventDefault();
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
  
  // Do somethin g else
  var createdAt = moment().format('h:mm a');
  var messageTextbox = jQuery('[name=message]');
  //console.log(createdAt);
  socket.emit('createMessage', 
  {
    from:'Guest', 
    text:jQuery('[name=message]').val(),
    createdAt: createdAt
  }, 
  function(data){
    //console.log('Got it', data);
  });
});

var video = document.getElementById("myVideo");
var btn = document.getElementById("videoBtn");

function videoCtrl() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    videoPause();
  }
}

var audio = document.getElementById("theaudio");
var abtn = document.getElementById("audioBtn");

function audioCtrl() {
  if (audio.paused) {
    audio.play();
    abtn.innerHTML = "Mute";
  } else {
    audio.pause();
    abtn.innerHTML = "Un-mute";
  }
}

function videoPause() {
  console.log("in videopause");
  video.pause();
  btn.innerHTML = "Play";
}

setTimeout(function(){ videoPause() }, 4600);
