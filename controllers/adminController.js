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

exports.admin_list = function(req, res, next) {

  console.log('in controLLER');
  
  var AllRecs = [];
  function OneRec(){}
  OneRec.prototype.bt = true;
  OneRec.prototype.sbt = null;
  OneRec.prototype.st = null;
  OneRec.prototype.sst = null;
  var bookingtypes;
  let subbookingtypes = new Object();
  // BookingType.find()
  //   .sort([['name', 'ascending']])
  //   .exec(function (err, list_bookingtypes) {
        
      // if (err) { return next(err); }
      // Successful, so render.  

      // bookingtypes = list_bookingtypes + subbookingtypes;
      // console.log("");
      // console.log("BrecCOMBO - "+bookingtypes);
      // console.log("BlenCOMBO - "+bookingtypes.length);
      // console.log("");
  
      // console.log("Brec1-"+bookingtypes);
      // console.log("Blen-"+bookingtypes.length);
      // for (var item in bookingtypes) {
      //   var OneReco = new OneRec();
      //   OneReco.name = item.name;
      //   AllRecs.push(OneReco);
      // }
  
      // console.log("Brec2-"+AllRecs);
      // console.log("Blen2-"+AllRecs.length);
  
    //   res.render('adminpage.hbs', { list_bookingtypes:  list_bookingtypes});
    // });

    SubBookingType.find()
    .sort([['subname', 'ascending']])
    .exec(function (err, list_subbookingtypes) {
        
      if (err) { return next(err); }
      // Successful, so render.
      // subbookingtypes = list_subbookingtypes;
      // console.log("");
      console.log("sub books = " + list_subbookingtypes);
      // var com = list_bookingtypes +", "+ list_subbookingtypes;
      // console.log("Brec2-"+com);
      // console.log("Blen2-"+subbookingtypes.length);
      // console.log("");

      // var test = JSON.parse('{ "_id": 5addce93af96a919d95f77e7, "name": "zabctest1234"}, { "_id": 5adeb4537e0d482c408effdd, "name": "activities" }');
      res.render('adminpage.hbs', { list_subbookingtypes:  list_subbookingtypes, list_bookingtypes:"{'id':'1111','name':'abc'}, {'id':'1112','name':'abc2'}"});
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
      subname: req.body.subname,
      parent:req.params.id
    });
      
      sbt.save(function (err) {
        if (err) { return next(err); }
        // Success
        // req.flash('success', 'Successfuly created event!');
        req.flash('success', 'Successfuly created event! 11');
        console.log("flash= Successfuly created event! 11");
        console.log("from system = " + req.flash('success'));
        // res.redirect('/admin/infoforadmin');
      });

      SubBookingType.findOne({ subname: 'act1' })
      .populate('parent')
      .exec(function (err, subtype) {
        if (err) return handleError(err);
        console.log('a subtype'+subtype);
        if (subtype != null) console.log('The name is %s', subtype.parent.name);
        // prints "The author is Ian Fleming"
      });
      res.redirect('/admin/infoforadmin');

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