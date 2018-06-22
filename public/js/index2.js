const socket = io();
let htmlPrev="";
//let html="";

let intGrType=1;
let intGrTypePrev=1;
if (document.getElementById('bb1') != null) setInterestGroup(1);
let bbel = document.getElementById("bb1");
if (bbel != null ) bbel.style.color = "blue";

let  html = '<div class="boxed">... updating weather info ...</div> ';
$("#weather_placeholder").html(html);

socket.on('connect', function() {
  let time = new Date();
  console.log('Connected to server at '+time);
});

socket.on('disconnect', function() {
  let time = new Date();
  console.log('Disconnected to server at '+time);
});

socket.emit('readShoutMessages', 
  function(data){
    //console.log('Got it', data);
});

socket.emit('requestWeatherData', 
  function(data){
    console.log('INDEX2 HTML B41=');
    updateWeatherInfo(data);
});

socket.on('weatherData',function(data){
  console.log('INDEX2 HTML B42=');
  updateWeatherInfo(data);
});

socket.on('newShoutMessage',function(message){

  let chatData = [{from:message.from, createdAt:message.createdAt, text:message.text }];
   let theTemplateScript = $("#shout-template").html(); 
   if (theTemplateScript != null) {
      let theTemplate = Handlebars.compile(theTemplateScript);
      let html = theTemplate(chatData);
      $("#shoutboard").html(html+htmlPrev); 
      htmlPrev = html + htmlPrev;
   }
});

socket.on('newMessage',function(message){

  //let timePosted = moment().format('h:mm a');
  //console.log("it works: "+message.text + " timePosted = "+timePosted);
  // let html = `<p><span style="color:red">${message.from}}</span> - <span style="color:gray">@ ${timePosted}} </span> : <span style="color:green"> ${message.text}} </span></p>`;
  // let html = `<p>${message.from} @ ${timePosted}: ${message.text}</p>`;
  // jQuery('#messages').append(html);

  //console.log("intGrType = " + message.intGr);
  let changedForPrivacy = "##"+message.from.substring(2);
  let chatData = [{from:changedForPrivacy, timePosted:message.createdAt, text:message.text }];
  let theTemplateScript = $("#chat-template").html(); 
   if (theTemplateScript != null && message.intGr == intGrType) {
      let theTemplate = Handlebars.compile(theTemplateScript); 
      //  console.log("data = " + chatData[0].from);
      //  console.log("data = " + chatData[0].text);
      //  console.log("html = " + theTemplate(chatData));
      $("#messages").append(theTemplate(chatData));
      jQuery('[name=message]').val('');
      scrollToBottom();
  }
});

socket.on('topicMessages',function(topicChats){

  $("#messages").html('');
  console.log("topicChats == null - ", topicChats == null );
  // console.log("topicChats = "+topicChats[0].text);
  // console.log("topicChats = "+topicChats.length);
  if (topicChats != null) {
    
    for (let i = 0, len = topicChats.length; i < len; i++) {
      let message = topicChats[i];
      // console.log("message = "+message);
      // console.log("message room = "+message.room_n);
      if (message != null && message.room_n != null) {
        let changedForPrivacy = "##"+message.room_n.substring(2);
        let chatData = [{from:changedForPrivacy, timePosted:message.dateTimeStr, text:message.text }];
        let theTemplateScript = $("#chat-template").html(); 
        if (theTemplateScript != null && message.intGr == intGrType) {
            let theTemplate = Handlebars.compile(theTemplateScript); 
            $("#messages").append(theTemplate(chatData));
        }
      }
    }
    scrollToBottom();
  }
});

socket.on('shoutMessages',function(topicChats){

  $("#shoutboard").html('');
  //console.log("topicChats == null - ", topicChats == null );
  console.log("topicChats = "+topicChats.length);
  //console.log("topicChats = "+topicChats[0].text);
  //console.log("topicChats = "+topicChats[0].createdAt);
  if (topicChats != null) {
    
    for (let i = 0, len = topicChats.length; i < len; i++) {
      let message = topicChats[i];

      if (message != null ) {
        let chatData = [{from:message.from, createdAt:message.createdAt, text:message.text }];
        let theTemplateScript = $("#shout-template").html(); 
        if (theTemplateScript != null) {
          let theTemplate = Handlebars.compile(theTemplateScript);
          
          console.log("i="+i);
          // console.log("htmlPrev = " + htmlPrev);
          let html = theTemplate(chatData);
          $("#shoutboard").html(html+htmlPrev); 
          htmlPrev = html + htmlPrev;
        }
      }
    }
  }
});


socket.on('data4table', function(data){
  for (let i = 0, len = data.length; i < len; i++) {
    let pack = data[i];

    let elem = document.getElementById(pack.id);

    if (pack.evenTime) elem.style.color = "black";
    if (!pack.evenTime) elem.style.color = "green";
    elem.innerHTML = pack.msg;
  }
});

// window.addEventListener('submit', function(evt) {
//   evt.preventDefault();
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
  
  // Do somethin g else
  let createdAt = moment().format('h:mm a');
  let messageTextbox = jQuery('[name=message]');
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
let createdAt = moment().format('h:mm a');
let messageTextbox = jQuery('[name=message]');
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

let video = document.getElementById("myVideo");
let btn = document.getElementById("videoBtn");

function videoCtrl() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    videoPause();
  }
}

let audio = document.getElementById("theaudio");
let abtn = document.getElementById("audioBtn");

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


function scrollToBottom() {
  var element = document.getElementById('messages');
   element.scrollIntoView(false);
}

function updateWeatherInfo(html) {
    if (html != null) {
      // console.log('INDEX ABCD 3344 HTML ='+html);
      $("#weather_placeholder").html(html);
      $('[data-toggle="tooltip"]').tooltip();
    } else {
      // console.log("Error = "+ e.message);
      let  html = '<div class="boxed">... could not update the weather info ...</div> ';
      $("#weather_placeholder").html(html);
    }
}

// function getJSessionId(){
//   let sid;
//   let strCookies = document.cookie;
//   console.log("strCookies="+strCookies);
//   let cookiearray = strCookies.split(';')
//   for(let i=0; i<cookiearray.length; i++){
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