const moment = require('moment');
const All_Chats = require('../../models/all_chats');

let generateMessage = (from, text, intGr) => {

    let momentDate = moment().format('DD MMM YYYY HH:mm:ss')
    let jsDateStart = moment();

    let sbt = new All_Chats({
        room_n: from,
        dateTime: jsDateStart,
        dateTimeStr: moment().format('DD MMM h:mm a'),
        text: text,
        intGr : intGr
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

module.exports = {generateMessage};