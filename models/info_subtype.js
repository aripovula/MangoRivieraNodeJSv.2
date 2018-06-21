const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var HeaderType = mongoose.model('HeaderType', HeaderType);

let Info_SubTypeSchema = new Schema({
    parent: { type: Schema.Types.ObjectId, ref: 'HeaderType' },
    subname: {type: String, required: true, unique: true, min: 3, max: 100},
    infotype : {type: String},
    message: {type: String, min: 3, max: 100},
    infowebpage: {type: String, min: 3, max: 100},
    actionmsg: {type: String, required: true, min: 3, max: 100}
});

// Virtual for this genre instance URL.
Info_SubTypeSchema
.virtual('url')
.get(function () {
    console.log('READ FROM ');
  return '/info_subtype/'+this._id;
});

// Export model.
module.exports = mongoose.model('Info_SubType', Info_SubTypeSchema);
