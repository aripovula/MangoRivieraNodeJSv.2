
var bb = 0;
var shoutMessage;

var messages = [
    "Dear all, finally the day of sports contests has come - are you ready to have a lot of fun in the beach area today? Don't forget - contests start at 11:00 in the beach area",
    "Today's special - bla bla",
    "to greet our new guests bla bla "
];

console.log("1="+bb);

$(document).ready(function () {
    slide();
    console.log("2="+bb);
});

function slide() {
    // your code here
    console.log("3a="+bb+ ` msg = ${messages[bb]}`);
    
    if (bb<messages.length) {
        var createdAt = moment().format('h:mm a');
        socket.emit('createShoutMessage', 
        {
        from:'', 
        text:`${messages[bb]}`,
        createdAt: createdAt
        }, 
        function(data){
        console.log('Got it ', data);
        });        
    }

    bb++; //if (bb===messages.length) break;

    setTimeout(slide, 5*1000);
}

