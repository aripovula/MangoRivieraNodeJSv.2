var socket = io();
var htmlPrev="";
//var html="";

var intGrType=1;
var intGrTypePrev=1;
if (document.getElementById('bb1') != null) setInterestGroup(1);
var bbel = document.getElementById("bb1");
if (bbel != null ) bbel.style.color = "blue";


socket.on('connect', function() {
  console.log('Connected to server at ');
});

socket.on('disconnect', function() {
  console.log('Disconnected to server');
});

socket.emit('readShoutMessages', 
  function(data){
    console.log('Got it', data);
});

socket.on('newShoutMessage',function(message){

  var chatData = [{from:message.from, createdAt:message.createdAt, text:message.text }];
   var theTemplateScript = $("#shout-template").html(); 
   if (theTemplateScript != null) {
      var theTemplate = Handlebars.compile(theTemplateScript);
      var html = theTemplate(chatData);
      $("#shoutboard").html(html+htmlPrev); 
      htmlPrev = html + htmlPrev;
   }
});

socket.on('newMessage',function(message){

  //var timePosted = moment().format('h:mm a');
  //console.log("it works: "+message.text + " timePosted = "+timePosted);
  // var html = `<p><span style="color:red">${message.from}}</span> - <span style="color:gray">@ ${timePosted}} </span> : <span style="color:green"> ${message.text}} </span></p>`;
  // var html = `<p>${message.from} @ ${timePosted}: ${message.text}</p>`;
  // jQuery('#messages').append(html);

  //console.log("intGrType = " + message.intGr);
  var changedForPrivacy = "##"+message.from.substring(2);
  var chatData = [{from:changedForPrivacy, timePosted:message.createdAt, text:message.text }];
  var theTemplateScript = $("#chat-template").html(); 
   if (theTemplateScript != null && message.intGr == intGrType) {
      var theTemplate = Handlebars.compile(theTemplateScript); 
      //  console.log("data = " + chatData[0].from);
      //  console.log("data = " + chatData[0].text);
      //  console.log("html = " + theTemplate(chatData));
      $("#messages").append(theTemplate(chatData));

      jQuery('[name=message]').val('');
  }
});

socket.on('topicMessages',function(topicChats){

  $("#messages").html('');
  console.log("topicChats == null - ", topicChats == null );
  //console.log("topicChats = "+topicChats[0].text);
  if (topicChats != null) {
    
    for (var i = 0, len = topicChats.length; i < len; i++) {
      let message = topicChats[i];

      if (message != null && message.room_n != null) {
        var changedForPrivacy = "##"+message.room_n.substring(2);
        var chatData = [{from:changedForPrivacy, timePosted:message.dateTimeStr, text:message.text }];
        var theTemplateScript = $("#chat-template").html(); 
        if (theTemplateScript != null && message.intGr == intGrType) {
            var theTemplate = Handlebars.compile(theTemplateScript); 
            $("#messages").append(theTemplate(chatData));
        }
      }
    }
  }
});

socket.on('shoutMessages',function(topicChats){

  $("#shoutboard").html('');
  // console.log("topicChats == null - ", topicChats == null );
  // console.log("topicChats = "+topicChats.length);
  // console.log("topicChats = "+topicChats[0].text);
  // console.log("topicChats = "+topicChats[0].createdAt);
  if (topicChats != null) {
    
    for (var i = 0, len = topicChats.length; i < len; i++) {
      let message = topicChats[i];

      if (message != null ) {
        var chatData = [{from:message.from, createdAt:message.createdAt, text:message.text }];
        var theTemplateScript = $("#shout-template").html(); 
        if (theTemplateScript != null) {
          var theTemplate = Handlebars.compile(theTemplateScript);
          
          // console.log("i="+i);
          // console.log("htmlPrev = " + htmlPrev);
          var html = theTemplate(chatData);
          $("#shoutboard").html(html+htmlPrev); 
          htmlPrev = html + htmlPrev;
        }
      }
    }
  }
});


socket.on('data4table', function(pack){
  //console.log("book id - "+id);
    let elem = document.getElementById(pack.id);
    //elem.setAttribute('value',"40% occupied");
    //elem.html = 'Occupancy: 40%';
    
    if (pack.evenTime) elem.style.color = "blue";
    if (!pack.evenTime) elem.style.color = "green";
    elem.innerHTML = pack.msg;
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
    from:jQuery('[name=usid]').val(),
    text:jQuery('[name=message]').val(),
    intGr: intGrType,
    createdAt: createdAt
  }, 
  function(data){
    //console.log('Got it', data);

  });
});

jQuery('#shoutMessage-form').on('submit', function (e) {
  e.preventDefault();

// Do somethin g else
var createdAt = moment().format('h:mm a');
var messageTextbox = jQuery('[name=message]');
//console.log(createdAt);
socket.emit('createShoutMessage', 
{
  from:jQuery('[name=usid]').val(),
  text:jQuery('[name=message]').val(),
  intGr: intGrType,
  createdAt: createdAt
}, 
function(data){
  //console.log('Got it', data);

});
jQuery('[name=message]').val('');
});

function setInterestGroup(groupType){

  intGrTypePrev = intGrType;
  intGrType = groupType;
  let b1 = 'bb'+groupType;
  let b2 = 'bb'+intGrTypePrev;

  document.getElementById(b1).style.color = "blue";
  document.getElementById(b2).style.color = "green";
  console.log("InterestGroup = " + groupType );
  
  socket.emit('readTopicMessages', 
  {
    intGr: intGrType
  }, 
  function(data){
    console.log('Got it', data);
  });
}

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

// function getJSessionId(){
//   var sid;
//   var strCookies = document.cookie;
//   console.log("strCookies="+strCookies);
//   var cookiearray = strCookies.split(';')
//   for(var i=0; i<cookiearray.length; i++){
//     name = cookiearray[i].split('=')[0];
//     value = cookiearray[i].split('=')[1];
//     if(name == 'sid')
//       sid = value;
//   }
//   return sid;
// }

// function checkIfSessionIsActiveEvery20mins() {

//   let sessionID = getJSessionId();
//   console.log("sessionID="+sessionID);
  
//   socket.emit('readTopicMessages', 
//   {
//     sessionID: sessionID
//   }, 
//   function(data){
//     console.log('Got it', data);
//   });

//   setTimeout(checkIfSessionIsActiveEvery20mins, 10*60*1000); // for demo purposes updates every minute
// }

// checkIfSessionIsActiveEvery20mins();

// socket.on('SessionStatusBack',function(status){
//    console.log("session status = " + status);
// });