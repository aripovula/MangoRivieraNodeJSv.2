var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//var HeaderType = mongoose.model('HeaderType', HeaderType);

var Users_BookingSchema = new Schema({
    name: {type: String, required: true, unique: true, min: 3, max: 100},
    date : {type: Date, required: true},
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



// Export model.
module.exports = mongoose.model('Users_Booking', Users_BookingSchema);
