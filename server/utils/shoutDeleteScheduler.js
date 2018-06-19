const util = require('util');
const All_Shouts = require('../../models/all_shouts');
//const mongoose = require('mongoose');

function deleteOldShoutsEveryMinute() {
    console.log('********************');
    console.log('*                  *');
    getRidOfOlderShoutsPromise();
    setTimeout(deleteOldShoutsEveryMinute, 90 * 1000 );
}

// function deleteOldShouts(){
//     readShouts(function (data){
//         let qnty = data.length;
//         console.log("shouts before delete = "+qnty);
//       });
    
//     let d = new Date();
//     let TwoMinuteAgo = d - 1000 * 90 ;
//     //console.log('current time = '+d);
//     //console.log('TwoMinuteAgo = '+TwoMinuteAgo);
//     All_Shouts.deleteMany({ dateTime: {$lt: TwoMinuteAgo}}, function(err) {});

//     readShouts(function (data){
//         let qnty = data.length;
//         console.log("shouts after delete = "+qnty);
//     });

// }

// function readShouts (callback){

//     All_Shouts
//     .find({})
//     .sort([['dateTime', 'ascending']])
//     .exec(function (err, data){
//       return callback(data);
//     });
// }

getRidOfOlderShoutsPromise = () => {
    return readShoutsPromise('BEFORE')
    .then(() => {
        return deleteOlderShoutsPromise();
    })
    .then(() => {
        return readShoutsPromise('AFTER')
    })
    .catch(err => console.log(err.message));
}

deleteOlderShoutsPromise = () => {
    return new Promise ( (resolve, reject) => {
        console.log("in deleteOlderShouts");
        let d = new Date();
        let TwoMinuteAgo = d - 1000 * 90 ;
        All_Shouts.deleteMany({ dateTime: {$lt: TwoMinuteAgo}}, function(err) {
            if (err) reject();
            console.log("DELETED OLDs at "+d);
            resolve();        
        });
    });
}

readShoutsPromise = (tex) => {
    return new Promise( (resolve, reject) => {
        console.log("in readShoutsPromise -"+tex);
        All_Shouts
        .find({})
        .sort([['dateTime', 'ascending']])
        .exec(function (err, data){
            if (err) reject();
            let d = new Date();
            console.log("shouts "+tex+" delete PROMISE = "+data.length +" date ="+d);
            resolve(data);
        });    
    });
}


module.exports = {deleteOldShoutsEveryMinute};