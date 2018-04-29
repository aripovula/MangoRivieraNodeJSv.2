var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HeaderType = mongoose.model('HeaderType', HeaderType);

var Booking_SubTypeSchema = new Schema({
    parent: { type: Schema.Types.ObjectId, ref: 'HeaderType' },
    subname: {type: String, required: true, unique: true, min: 3, max: 100},
    infotype : {type: String},
    message: {type: String, min: 3, max: 100},
    infowebpage: {type: String, min: 3, max: 100},
    actionmsg: {type: String, required: true, min: 3, max: 100}
});

// Virtual for this genre instance URL.
Booking_SubTypeSchema
.virtual('url')
.get(function () {
    console.log('READ FROM ');
  return '/booking_subtype/'+this._id;
});



// Export model.
module.exports = mongoose.model('Booking_SubType', Booking_SubTypeSchema);
