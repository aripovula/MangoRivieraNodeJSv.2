const moment = require('moment');
const All_Shouts = require('../../models/all_shouts');

// messages to simulate Broadcast messages
var messages = [
    
    "Today's special - enjoy specialties from Chef Gustau at 'SeaSide Garden' restaurant",
    "Our Wellness club offers today 50% discount to all procedures not already included to your resort package",
    "to greet Fashion show participants we invite you to a Fireworks show to start at 9 p.m. this evening",
    "DJ Piligrim's club night laser show starts at MangoClub 9 p.m. - join us to enjoy music, laser show and for a lot of fun !",
    "Finally the day of sports contests has come - are you ready to have a lot of fun in the beach area today? Don't forget - contests start at 11:00 in the beach area",
    "Get special discount to the Dolphine Show today - almost two hours of unforgettable show",
    "FREE ice-cream at the 'gelato' spot at the poolside bar from 11 a.m. to 5 p.m. - enjoy the best ice-cream with amazing flavours for free",
    "NEW: Please visit our 'Rent a cinema' spot in the main lobby to rent your favourite movies in DVDs"
];

var generateShoutMessage = (intGr) => {

    var sbt = new All_Shouts({
        text: messages[intGr],
        dateTime: moment(),
        createdAt: moment().format('DD MMM h:mm a')
    });
        
        sbt.save(function (err) {
          if (err) { return next(err); }
        });  

    return {
        text: messages[intGr],
        createdAt: moment().format('DD MMM h:mm a')
    };
};

module.exports = {generateShoutMessage};