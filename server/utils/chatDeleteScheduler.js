const All_Chats = require('../../models/all_chats');
//const mongoose = require('mongoose');

function deleteOldChatsEveryWeek() {
    deleteOldChats();
    setTimeout(deleteOldChatsEveryWeek, 7*24*60*60*1000);
}

function deleteOldChats(){
    let d = new Date();
    let sevenDayAgo = d - 1000 * 60 * 60 *24 * 7;
    //console.log('d = '+d*1+'  sevenDayAgo = '+sevenDayAgo);

    All_Chats.deleteMany({ dateTime: {$lt: sevenDayAgo}}, function(err) {});
}

module.exports = {deleteOldChatsEveryWeek};