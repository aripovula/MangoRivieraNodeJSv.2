var BookingType = require('../models/bookingtype');
// var Book = require('../models/book');
var async = require('async');

// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

// Display list of all BookingTypes.
exports.bookingtype_list = function(req, res, next) {

  console.log('in controLLER');
  
  BookingType.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_bookingtypes) {
      console.log('in controLLER 22 = '+list_bookingtypes +list_bookingtypes.name );
      if (err) { return next(err); }
      // Successful, so render.
      console.log('in controLLER 44');
      res.render('bookingtype_list', { title: 'Booking Type List', list_bookingtypes:  list_bookingtypes});
    });

};
