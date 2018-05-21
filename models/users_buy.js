var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//var resNo = getResValue();
//var HeaderType = mongoose.model('HeaderType', HeaderType);

var Users_BuySchema = new Schema({
    buyname: {type: String, required: true, unique: true, min: 3, max: 100},
    //date : {type: Date, required: true},
    reservationNumber: {type: String},
    date: {type: Date, required: true},
    price: {type: Number, required:true},
    qnty: {type: Number, required:true}
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
