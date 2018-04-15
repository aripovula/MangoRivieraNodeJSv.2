var moment = require('moment');

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().format('h:mm a')
    };
};

module.exports = {generateMessage};