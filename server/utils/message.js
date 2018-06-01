var moment = require('moment');

var generateMessage = (from, text, intGr) => {
    return {
        from,
        text,
        intGr,
        createdAt: moment().format('h:mm a')
    };
};

module.exports = {generateMessage};