const moment = require('moment');

var generateMessage4admin = (from, text, intGr) => {

    return {
        from,
        text,
        intGr,
        createdAt: moment().format('DD MMM h:mm a')
    };
};

module.exports = {generateMessage4admin};