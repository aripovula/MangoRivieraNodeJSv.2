var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookingTypeSchema = new Schema({
    name: {type: String, required: true, unique: true, min: 3, max: 100}
});

// Virtual for this genre instance URL.
BookingTypeSchema
.virtual('url')
.get(function () {
    console.log('READ FROM ');
  return '/bookingtype/'+this._id;
});

// Export model.
module.exports = mongoose.model('BookingType', BookingTypeSchema);
