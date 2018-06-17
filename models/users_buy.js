var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//var resNo = getResValue();
//var HeaderType = mongoose.model('HeaderType', HeaderType);

var Users_BuySchema = new Schema({
    buyID: {type: String, required: true},
    buyname: {type: String, required: true, min: 3, max: 100},
    //date : {type: Date, required: true},
    userID: {type: String, required: true},
    date: {type: Date, required: true},
    dateStr: {type: String, required: true},
    price: {type: Number, required:true},
    qnty: {type: Number, required:true},
    total: {type: Number, required:true},
    isActive: {type: Boolean, default: true}
});

// Virtual for this genre instance URL.
Users_BuySchema
.virtual('url')
.get(function () {
    //console.log('READ FROM ');
  return '/users_buy/'+this._id;
});

// Export model.
module.exports = mongoose.model('Users_Buy', Users_BuySchema);
