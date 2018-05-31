var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//var resNo = getResValue();
//var HeaderType = mongoose.model('HeaderType', HeaderType);

var Users_BookingSchema = new Schema({
    bookingname: {type: String, required: true, min: 3, max: 100},
    //date : {type: Date, required: true},
    userID: {type: String, required: true},
    date: {type: Date, required: true},
    dateStr: {type: String, required: true},
    starttime: {type: String, required: true},
    endtime : {type: String, required: true}
});

// Virtual for this genre instance URL.
Users_BookingSchema
.virtual('url')
.get(function () {
    //console.log('READ FROM ');
  return '/users_booking/'+this._id;
});

// Users_BookingSchema.prototype.reservationNumber = function() {
//     return "4236";  // ASSUME THIS RETURNS UNIQUE RESERVATION NUMBER BEFORE MAKING A SPA PROCEDURE BOOKING
// }

// Export model.
module.exports = mongoose.model('Users_Booking', Users_BookingSchema);
