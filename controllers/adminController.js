var BookingType = require('../models/bookingtype');
// var Book = require('../models/book');
var async = require('async');

// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

// Display list of all BookingTypes.
exports.admins_list = function(req, res, next) {

  console.log('in controLLER');
  
  BookingType.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_bookingtypes) {
      var thebookingtypes = list_bookingtypes;
        
      if (err) { return next(err); }
      // Successful, so render.
      console.log('in controLLER 44 adminsLIST');
      res.render('adminpage.hbs', { list_bookingtypes:  list_bookingtypes});
    });

};

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
exports.bookingtype_create_post = [

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    console.log("type="+req.body.name);
    var bt = new BookingType(
        { name: req.body.name }
      );
      
      bt.save(function (err) {
        if (err) { return next(err); }
        // Success 
        // req.flash('success', 'Successfuly created event!');
        req.flash('success', 'Successfuly created event! 11');
        console.log("flash= Successfuly created event! 11");
        console.log("from system = " + req.flash('success'));
        res.redirect('/admin/infoforadmin');
      });
  }];



  // Handle Genre update on POST.
exports.bookingtype_update_post = [
   
  // Validate that the name field is not empty.
  // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
  
  // Sanitize (trim and escape) the name field.
  // sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      
      // Extract the validation errors from a request .
      // const errors = validationResult(req);

  // Create a genre object with escaped and trimmed data (and the old id!)
      var bt = new BookingType(
        {
        name: req.body.name,
        _id: req.params.id
        }
      );

      console.log("IIIDD="+req.params.id);
      console.log("NNNAme="+req.body.name);

      // if (!errors.isEmpty()) {
      //     // There are errors. Render the form again with sanitized values and error messages.
      //     res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
      // return;
      // }
      // else {
          // Data from form is valid. Update the record.
          BookingType.findByIdAndUpdate(req.params.id, bt, {}, function (err,cback) {
              if (err) { return next(err); }
                 // Successful - redirect to genre detail page.
                 res.redirect('/admin/infoforadmin');
              });
      //}
  }
];
  

  