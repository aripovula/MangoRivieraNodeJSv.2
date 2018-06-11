const moment = require('moment');

var messages = [
    "Dear all, finally the day of sports contests has come - are you ready to have a lot of fun in the beach area today? Don't forget - contests start at 11:00 in the beach area",
    "Today's special - bla bla",
    "to greet our new group of guests we welcome you to fireworks tonight at 9 p.m.",
    "abc",
    "xyz",
    "qwer",
    "asdf",
    "zxcv",
    "qaz",
    "wsx"
];

var generateShoutMessage = (intGr) => {

    return {
        text: messages[intGr],
        createdAt: moment().format('DD MMM h:mm a')
    };
};

module.exports = {generateShoutMessage};