var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//var resNo = getResValue();
//var HeaderType = mongoose.model('HeaderType', HeaderType);

var Users_BookingSchema = new Schema({
    bookingname: {type: String, required: true, unique: true, min: 3, max: 100},
    //date : {type: Date, required: true},
    reservationNumber: {type: String},
    starttime: {type: Date, required: true},
    endtime : {type: Date, required: true}
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
