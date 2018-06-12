const All_Shouts = require('../../models/all_shouts');
//const mongoose = require('mongoose');

function deleteOldShoutsEveryMinute() {
    deleteOldShouts();
    setTimeout(deleteOldShoutsEveryMinute, 60*1000 * 2);
}

function deleteOldShouts(){
    let d = new Date();
    let TwoMinuteAgo = d - 1000 * 60 * 2 ;

    All_Shouts.deleteMany({ createdAt: {$lt: TwoMinuteAgo}}, function(err) {});
}

module.exports = {deleteOldShoutsEveryMinute};