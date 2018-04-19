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
      var thebookingtypes = list_bookingtypes;
    
      //console.log('in controLLER 22 = '+list_bookingtypes +list_bookingtypes.name );
      console.log('in 22 1='+thebookingtypes[0].name);
      console.log('in 22 1='+thebookingtypes[6].name);
    
      if (err) { return next(err); }
      // Successful, so render.
      console.log('in controLLER 44');
      res.render('booking.hbs', { list_bookingtypes:  list_bookingtypes});
    });

};


// Handle Genre create on POST.
exports.bookingtype_create_post = 

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    console.log("type="+req.body.type);
    var bt = new BookingType(
        { name: req.body.type }
      );
      
      bt.save(function (err) {
        if (err) { return next(err); }
      });
  }
;