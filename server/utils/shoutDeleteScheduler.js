const All_Shouts = require('../../models/all_shouts');
//const mongoose = require('mongoose');

function deleteOldShoutsEveryMinute() {
    deleteOldShouts();
    setTimeout(deleteOldShoutsEveryMinute, 90 * 1000 );
}

function deleteOldShouts(){
    readShouts(function (data){
        let qnty = data.length;
        console.log("shouts before delete = "+qnty);
      });
    
    let d = new Date();
    let TwoMinuteAgo = d - 1000 * 90 ;
    //console.log('current time = '+d);
    //console.log('TwoMinuteAgo = '+TwoMinuteAgo);
    All_Shouts.deleteMany({ dateTime: {$lt: TwoMinuteAgo}}, function(err) {});

    readShouts(function (data){
        let qnty = data.length;
        console.log("shouts after delete = "+qnty);
    });

}

function readShouts (callback){

    All_Shouts
    .find({})
    .sort([['dateTime', 'ascending']])
    .exec(function (err, data){
      return callback(data);
    });
}

module.exports = {deleteOldShoutsEveryMinute};