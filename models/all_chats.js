const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//var resNo = getResValue();
//var HeaderType = mongoose.model('HeaderType', HeaderType);

let All_ChatsSchema = new Schema({

    room_n: {type: String},
    dateTime: {type: Date},
    dateTimeStr: {type: String},
    text: {type: String},
    intGr : {type: Number}
});

// Virtual for this genre instance URL.
All_ChatsSchema
.virtual('url')
.get(function () {
    //console.log('READ FROM ');
  return '/all_chats/'+this._id;
});

// Users_BookingSchema.prototype.reservationNumber = function() {
//     return "4236";  // ASSUME THIS RETURNS UNIQUE RESERVATION NUMBER BEFORE MAKING A SPA PROCEDURE BOOKING
// }

// Export model.
module.exports = mongoose.model('All_Chats', All_ChatsSchema);
