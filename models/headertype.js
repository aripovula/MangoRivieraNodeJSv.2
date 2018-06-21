var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HeaderTypeSchema = new Schema({
    name: {type: String, required: true, unique: true, min: 3, max: 100},
    sequence: {type: Number},
});

// Virtual for this genre instance URL.
HeaderTypeSchema
.virtual('url')
.get(function () {
    console.log('READ FROM ');
  return '/headertype/'+this._id;
});

// Export model.
module.exports = mongoose.model('HeaderType', HeaderTypeSchema);
