var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookingType = mongoose.model('BookingType', BookingType);

var SubBookingTypeSchema = new Schema({
    parent: { type: Schema.Types.ObjectId, ref: 'BookingType' },
    subname: {type: String, required: true, unique: true, min: 3, max: 100}
});

// Virtual for this genre instance URL.
SubBookingTypeSchema
.virtual('url')
.get(function () {
    console.log('READ FROM ');
  return '/subbookingtype/'+this._id;
});



// Export model.
module.exports = mongoose.model('SubBookingType', SubBookingTypeSchema);
