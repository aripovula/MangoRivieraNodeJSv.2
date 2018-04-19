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
  console.log("it works SHOUT form2: "+message.text + " timePosted = "+message.createdAt);

   var chatData = [{from:message.from, createdAt:message.createdAt, text:message.text }];
   var theTemplateScript = $("#shout-template2").html(); 
   var theTemplate = Handlebars.compile(theTemplateScript);
   var html = theTemplate(chatData);

   $("#shoutboard2").html(html+htmlPrev);
   htmlPrev = html + htmlPrev;

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
