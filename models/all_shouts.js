var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var All_ShoutsSchema = new Schema({
    createdAt: {type: String},
    dateTime: {type: Date},
    text: {type: String}
});

// Virtual for this genre instance URL.
All_ShoutsSchema
.virtual('url')
.get(function () {
  return '/all_shouts/'+this._id;
});

// Export model.
module.exports = mongoose.model('All_Shouts', All_ShoutsSchema);
