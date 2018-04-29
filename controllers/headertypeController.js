var HeaderType = require('../models/headertype');
// var Book = require('../models/book');
var async = require('async');

// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

// Display list of all HeaderTypes.
exports.headertype_list = function(req, res, next) {

  console.log('in controLLER');
  
  HeaderType.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_headertypes) {
      var theheadertypes = list_headertypes;
    
      //console.log('in controLLER 22 = '+list_headertypes +list_headertypes.name );
      console.log('in 22 1='+theheadertypes[0].name);
      console.log('in 22 1='+theheadertypes[6].name);
    
      if (err) { return next(err); }
      // Successful, so render.
      console.log('in controLLER 44');
      res.render('booking.hbs', { list_headertypes:  list_headertypes});
    });

};


// Handle Genre create on POST.
exports.headertype_create_post = 

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    console.log("type="+req.body.type);
    var bt = new HeaderType(
        { name: req.body.type }
      );
      
      bt.save(function (err) {
        if (err) { return next(err); }
      });
  }
;