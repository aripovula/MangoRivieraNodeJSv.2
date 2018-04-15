var socket = io();



       
socket.on('connect', function() {
  console.log('Connected to server at ');  
});

socket.on('disconnect', function() {
  console.log('Disconnected to server');
});

socket.on('newMessage',function(message){

  var timePosted = moment().format('h:mm a');
  console.log("it works: "+message.text + " timePosted = "+timePosted);

  // var html = `<p>${message.from}: ${message.text}</p>`;
  // jQuery('#messages').append(html);

  var chatData = [{from:message.from, timePosted:timePosted, text:message.text }];
   var theTemplateScript = $("#chat-template").html(); 
   var theTemplate = Handlebars.compile(theTemplateScript); 
   console.log("data = " + chatData[0].from);
   console.log("data = " + chatData[0].text);
   console.log("html = " + theTemplate(chatData));
   $("#messages").append(theTemplate(chatData)); 

  jQuery('[name=message]').val('');
});


jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
  
  // Do somethin g else
  var createdAt = moment().format('h:mm a');
    var messageTextbox = jQuery('[name=message]');
  console.log(createdAt);
  socket.emit('createMessage', 
  {
    from:'USER', 
    text:jQuery('[name=message]').val(),
    createdAt: createdAt
  }, 
  function(data){
    console.log('Got it', data);
  });
});

var video = document.getElementById("myVideo");
var btn = document.getElementById("myBtn");

function myFunction() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    btn.innerHTML = "Play";
  }
}


