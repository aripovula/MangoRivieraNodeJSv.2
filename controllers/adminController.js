var HeaderType = require('../models/headertype');
var Booking_SubType = require('../models/booking_subtype');
var Sell_SubType = require('../models/sell_subtype');
var Info_SubType = require('../models/info_subtype');
// var Book = require('../models/book');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all HeaderTypes.

exports.admins_list = function(req, res, next) {
  async.series([
    function(callback){
      HeaderType.find({}).sort('-createdAt').exec(callback);
    },
    function(callback){
      Booking_SubType.find({}).populate('parent').sort([['subname', 'ascending']]).exec(callback);
    },
    function(callback){
      Sell_SubType.find({}).populate('parent').sort([['subname', 'ascending']]).exec(callback);
    },
    function(callback){
      Info_SubType.find({}).populate('parent').sort([['subname', 'ascending']]).exec(callback);
    },
    // function(callback){
    //   Sell_SubType
    //   .find({})
    //   .populate(
    //     {
    //       path: 'parent',
    //       match: { name: 'Activities'}
    //     }
    //   )
    //   .sort([['subname', 'ascending']])
    //   .exec(callback);
    // },

  ], function(err, results){
      res.render('adminpage.hbs',{
        //title:'custom',
        list_headertypes: results[0],
        list_booking_subtypes: results[1],
        list_sell_subtypes: results[2],
        list_info_subtypes: results[3],
        headertypes: results[0].length,
        booking_subtypes: results[1].length,
        sell_subtypes: results[2].length,
        info_subtypes: results[3].length,
        //all_subtypes: [results[1], results[2], results[3]],
        for_tables: [ results[0] , [results[1], results[2], results[3] ] ]
    });
  });
}

// Display list of all HeaderTypes.
exports.headertype_list = function(req, res, next) {

  console.log('in controLLER');
  
  HeaderType.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_headertypes) {
      var theheadertypes = list_headertypes;
        
      if (err) { return next(err); }
      // Successful, so render.
      console.log('in controLLER 44');
      res.render('adminpage.hbs', { list_headertypes:  list_headertypes});
    });

};

// Display list of all Booking_SubTypes.
exports.booking_subtype_list = function(req, res, next) {

  console.log('in controLLER');
  
  Booking_SubType.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_booking_subtypes) {
      var thebooking_subtypes = list_booking_subtypes;
        
      if (err) { return next(err); }
      // Successful, so render.
      res.render('booking.hbs', { list_headertypes:  list_headertypes});
    });

};

// Handle bt create on POST.
exports.headertype_create_post = [

  // Validate that the name field is not empty.
  body('type', 'Type name is required').isLength({ min: 3 }).trim(),

  // Sanitize (trim and escape) the name field.
  sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    console.log("type="+req.body.name);
    var bt = new HeaderType(
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




// Handle bst create on POST.
exports.booking_subtype_create_post = [

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.


  (req, res, next) => {

    // var name = HeaderType.findOne({ '_id': req.params.id })
    //             .exec( function(err, found_bt) {
    //                  if (err) { return next(err); }

    //                  return found_bt;
    //              });

    console.log("subname="+req.body.subname);
    // console.log("name="+name.name);
    var sbt = new Booking_SubType({ 
      parent : req.params.parent_id,
      subname : req.body.subname,
      infotype : req.params.infotype,
      message : req.body.msg,
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



  // Handle sst create on POST.
exports.sell_subtype_create_post = [

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.


  (req, res, next) => {

    // var name = HeaderType.findOne({ '_id': req.params.id })
    //             .exec( function(err, found_bt) {
    //                  if (err) { return next(err); }

    //                  return found_bt;
    //              });

    console.log("subname="+req.body.subname);
    // console.log("name="+name.name);
    var sbt = new Sell_SubType({ 
      parent : req.params.parent_id,
      subname : req.body.subname,
      infotype : req.params.infotype,
      message : req.body.msg,
      infowebpage : req.body.url,
      actionmsg : req.body.actionmsg,
      price : req.body.price
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



// Handle ist create on POST.
exports.info_subtype_create_post = [

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.


  (req, res, next) => {

    // var name = HeaderType.findOne({ '_id': req.params.id })
    //             .exec( function(err, found_bt) {
    //                  if (err) { return next(err); }

    //                  return found_bt;
    //              });

    console.log("subname="+req.body.subname);
    // console.log("name="+name.name);
    var sbt = new Info_SubType({ 
      parent : req.params.parent_id,
      subname : req.body.subname,
      infotype : req.params.infotype,
      message : req.body.msg,
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
exports.headertype_update_post = [
   
  // Validate that the name field is not empty.
  // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
  
  // Sanitize (trim and escape) the name field.
  // sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      
      // Extract the validation errors from a request .
      // const errors = validationResult(req);

  // Create a genre object with escaped and trimmed data (and the old id!)
      var bt = new HeaderType(
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
          HeaderType.findByIdAndUpdate(req.params.id, bt, {}, function (err,cback) {
              if (err) { return next(err); }
                 // Successful - redirect to genre detail page.
                 res.redirect('/admin/infoforadmin');
              });
      //}
  }
];
  



// Handle SBT update on POST.
  exports.booking_subtype_update_post = [
   
    // Validate that the name field is not empty.
    // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    // sanitizeBody('name').trim().escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
        
        // Extract the validation errors from a request .
        // const errors = validationResult(req);
  
    // Create a genre object with escaped and trimmed data (and the old id!)
    var sbt = new Booking_SubType({ 
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
            Booking_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.redirect('/admin/infoforadmin');
                });
        //}
    }
  ];





  // Handle SST update on POST.
  exports.sell_subtype_update_post = [
   
    // Validate that the name field is not empty.
    // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    // sanitizeBody('name').trim().escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
        
        // Extract the validation errors from a request .
        // const errors = validationResult(req);
  
    // Create a genre object with escaped and trimmed data (and the old id!)
    var sbt = new Sell_SubType({ 
      _id: req.params.id,
      parent:req.params.parent_id,
      subname: req.body.subname,
      infotype : req.params.infotype,
      message : req.body.msg,
      infowebpage : req.body.url,
      actionmsg : req.body.actionmsg,
      price : req.body.price

    });
  
        // if (!errors.isEmpty()) {
        //     // There are errors. Render the form again with sanitized values and error messages.
        //     res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
        // return;
        // }
        // else {
            // Data from form is valid. Update the record.
            Sell_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.redirect('/admin/infoforadmin');
                });
        //}
    }
  ];





  // Handle SBT update on POST.
  exports.info_subtype_update_post = [
   
    // Validate that the name field is not empty.
    // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    // sanitizeBody('name').trim().escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
        
        // Extract the validation errors from a request .
        // const errors = validationResult(req);
  
    // Create a genre object with escaped and trimmed data (and the old id!)
    var sbt = new Info_SubType({ 
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
            Info_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.redirect('/admin/infoforadmin');
                });
        //}
    }
  ];



// Handle Genre delete on POST.
exports.headertype_delete_post = function(req, res, next) {

  async.parallel({
      bt: function(callback) {
        HeaderType.findById(req.params.id).exec(callback);
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
              res.redirect('/admin/infoforadmin');
          });
      }
  });
};

// Handle SBT delete on POST.
exports.booking_subtype_delete_post = function(req, res, next) {

  async.parallel({
      bt: function(callback) {
        HeaderType.findById(req.params.id).exec(callback);
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
              res.redirect('/admin/infoforadmin');
          });
      }
  });
};