const Users_Booking = require('../../models/users_booking');
const Users_Buy = require('../../models/users_buy');
let thepercentage = [];
let onlyleft = [];

function simulateTableInfo(evenTime, bookingIDs2simulate, buyIDs2simulate) {
    let result = [];
    let i2 = 0;

    // console.log('AAAA Simulator = '+bookingIDs2simulate.length);
  
    for (let  i = 0, len = bookingIDs2simulate.length; i < len; i++) {
      
      // IF LIVE REAL DATA EXISTED I WOULD GET PERCENTAGE DATA AS FOLLOWS
      
      let bookingID = bookingIDs2simulate[i];
      let d = new Date();
      let anHourAgo = d - 1000 * 60 * 60;
      let anHourLater = d + 1000 * 60 * 60;
  
      let capacity = 80; 
      let currentUsers = Users_Booking.find({ bookingID: bookingID, dateTime: {$gt: anHourAgo}, dateTime: {$lt: anHourLater}}, function(err) {});
      let currentUsage = currentUsers.length;
      let percentOccupied = currentUsage / capacity;
  
      // TO SIMULATE DATA FOLLOWING IS USED
      let percentageChange = Math.floor(Math.random()*(2-1+1)+1);
      
      if (thepercentage[i] == null) thepercentage[i] = Math.floor(Math.random()*(80-60+1)+60);
      if (Math.floor(Math.random()*(2-1+1)+1) == 1) thepercentage[i] = thepercentage[i] - percentageChange; else thepercentage[i] = thepercentage[i] + percentageChange;
      if (thepercentage[i] < 40) thepercentage[i] = 40;
      if (thepercentage[i] > 90) thepercentage[i] = 90;
      let msg = thepercentage[i]+"% occupied";
      result[i2] = {id:bookingID, msg:msg, evenTime:evenTime};
      i2++;
      //io.emit('data4table',{id:bookingID, msg:msg, evenTime:evenTime});
      //console.log('Simulator = '+bookingID+" x="+counter);
    }
  
    for (let  i = 0, len = buyIDs2simulate.length; i < len; i++) {
      let buyID = buyIDs2simulate[i];
      let change = Math.floor(Math.random()*(2-1+1)+1);
      if (onlyleft[i] == null) onlyleft[i] = Math.floor(Math.random()*(70-50+1)+50);
      onlyleft[i] = onlyleft[i] - change;
      if (onlyleft[i] < 1) onlyleft[i] = Math.floor(Math.random()*(70-50+1)+50);
      let msg = onlyleft[i]+" tickets left";
    
      result[i2] = {id:buyID, msg:msg, evenTime:evenTime};
      i2++;
      // io.emit('data4table',{id:buyID, msg:msg, evenTime:evenTime});
      // console.log('Simulator = '+bookingID+" x="+counter);
    }
    // evenTime = !evenTime;
    // setTimeout(simulateTableInfo, 5*1000); // for demo purposes updates every minute
    return result;
  }

  module.exports = {simulateTableInfo};