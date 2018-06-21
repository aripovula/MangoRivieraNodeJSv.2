const moment = require('moment');
const All_Shouts = require('../../models/all_shouts');

let generateMessage4admin = (from, text, intGr) => {

    let sbt = new All_Shouts({
        text: text,
        dateTime: moment(),
        createdAt: moment().format('DD MMM h:mm a')
    });
        
        sbt.save(function (err) {
          if (err) { return next(err); }
        });  


    return {
        from,
        text,
        intGr,
        createdAt: moment().format('DD MMM h:mm a')
    };
};

module.exports = {generateMessage4admin};