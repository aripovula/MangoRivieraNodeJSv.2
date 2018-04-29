var BookingType = require('../models/bookingtype');
var SubBookingType = require('../models/subbookingtype');
// var Book = require('../models/book');
var async = require('async');

// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

// Display list of all BookingTypes.

exports.admins_list = function(req, res, next) {
  async.series([
    function(callback){
      BookingType.find({}).sort([['name', 'ascending']]).exec(callback);
    },
    function(callback){
      SubBookingType.find({}).populate('parent').sort([['subname', 'ascending']]).exec(callback);
    },
  ], function(err, results){
      res.render('adminpage.hbs',{
        //title:'custom',
        list_bookingtypes: results[0],
        list_subbookingtypes: results[1]
    });
  });
}

// Display list of all BookingTypes.
exports.bookingtype_list = function(req, res, next) {

  console.log('in controLLER');
  
  BookingType.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_bookingtypes) {
      var thebookingtypes = list_bookingtypes;
        
      if (err) { return next(err); }
      // Successful, so render.
      console.log('in controLLER 44');
      res.render('adminpage.hbs', { list_bookingtypes:  list_bookingtypes});
    });

};

// Display list of all SubBookingTypes.
exports.subbookingtype_list = function(req, res, next) {

  console.log('in controLLER');
  
  SubBookingType.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_subbookingtypes) {
      var thesubbookingtypes = list_subbookingtypes;
    
      //console.log('in controLLER 22 = '+list_bookingtypes +list_bookingtypes.name );
      console.log('in 22 1='+thesubbookingtypes[0].name);
      console.log('in 22 1='+thesubbookingtypes[6].name);
    
      if (err) { return next(err); }
      // Successful, so render.
      console.log('in controLLER 44');
      res.render('booking.hbs', { list_bookingtypes:  list_bookingtypes});
    });

};

// Handle bt create on POST.
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




// Handle sbt create on POST.
exports.subbookingtype_create_post = [

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.


  (req, res, next) => {

    // var name = BookingType.findOne({ '_id': req.params.id })
    //             .exec( function(err, found_bt) {
    //                  if (err) { return next(err); }

    //                  return found_bt;
    //              });

    console.log("subname="+req.body.subname);
    // console.log("name="+name.name);
    var sbt = new SubBookingType({ 
      parent : req.params.parent_id,
      subname : req.body.subname,
      infotype : req.params.infotype,
      message : req.body.message,
      infowebpage : req.body.url,
      actionmsg : req.body.actionmsg
    });
      
      sbt.save(function (err) {
        if (err) { return next(err); }
        // Success
        req.flash('success', 'Successfuly created event! 11');
        console.log("flash= Successfuly created event! 11");
        console.log("from system = " + req.flash('success'));
        res.redirect('/admin/infoforadmin');
      });


  }];

  // Handle BT update on POST.
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
  

  // Handle SBT update on POST.
  exports.subbookingtype_update_post = [
   
    // Validate that the name field is not empty.
    // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    // sanitizeBody('name').trim().escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
        
        // Extract the validation errors from a request .
        // const errors = validationResult(req);
  
    // Create a genre object with escaped and trimmed data (and the old id!)
    var sbt = new SubBookingType({ 
      _id: req.params.id,
      parent:req.params.parent_id,
      subname: req.body.subname,
      infotype : req.params.infotype,
      message : req.body.msg,
      infowebpage : req.body.url,
      actionmsg : req.body.actionmsg

    });
  
        // if (!errors.isEmpty()) {
        //     // There are errors. Render the form again with sanitized values and error messages.
        //     res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
        // return;
        // }
        // else {
            // Data from form is valid. Update the record.
            SubBookingType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.redirect('/admin/infoforadmin');
                });
        //}
    }
  ];

// Handle Genre delete on POST.
exports.bookingtype_delete_post = function(req, res, next) {

  async.parallel({
      bt: function(callback) {
        BookingType.findById(req.params.id).exec(callback);
      },
      genre_books: function(callback) {
          Book.find({ 'genre': req.params.id }).exec(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      // Success
      if (results.genre_books.length > 0) {
          // Genre has books. Render in same way as for GET route.
          res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
          return;
      }
      else {
          // Genre has no books. Delete object and redirect to the list of genres.
          Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
              if (err) { return next(err); }
              // Success - go to genres list.
              res.redirect('/catalog/genres');
          });

      }
  });

};

// Handle SBT delete on POST.
exports.subbookingtype_delete_post = function(req, res, next) {

  async.parallel({
      bt: function(callback) {
        BookingType.findById(req.params.id).exec(callback);
      },
      genre_books: function(callback) {
          Book.find({ 'genre': req.params.id }).exec(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      // Success
      if (results.genre_books.length > 0) {
          // Genre has books. Render in same way as for GET route.
          res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
          return;
      }
      else {
          // Genre has no books. Delete object and redirect to the list of genres.
          Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
              if (err) { return next(err); }
              // Success - go to genres list.
              res.redirect('/catalog/genres');
          });

      }
  });

};