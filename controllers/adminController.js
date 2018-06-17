var HeaderType = require('../models/headertype');
var Booking_SubType = require('../models/booking_subtype');
var Sell_SubType = require('../models/sell_subtype');
var Info_SubType = require('../models/info_subtype');
const Users_Booking = require('../models/users_booking');
const Users_Buy = require('../models/users_buy');
var User = require('../models/user');
// var Book = require('../models/book');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var async = require('async');
const flash = require('express-flash');
const stringify = require('json-stringify');

const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all HeaderTypes.

exports.admins_list = function(req, res, next) {
  //console.log("req.flash('success') 11="+req.flash('success'));
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
    function(callback){
      User.findById(req.session.userId).exec(callback);
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
      //console.log("req.flash('success') 22="+req.flash('success'));
      if (results[4] == null) {
        res.redirect('/users/homelocked'); 
      } else {
        //console.log("res.locals.sessionFlash="+res.locals.sessionFlash);
        //console.log("res.session.cookie.sessionFlash="+req.session.sessionFlash.message);
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
          for_tables: [ results[0] , [results[1], results[2], results[3] ] ],
          room_n: results[4].roomCode,

          expressFlash: req.flash('success'), 
          expressFailureFlash: req.flash('error')
          //sessionFlash: req.session.sessionFlash
    
      });
    }
  });
}

// // Display list of all HeaderTypes.
// exports.headertype_list = function(req, res, next) {

//   console.log('in controLLER');
  
//   HeaderType.find()
//     .sort([['name', 'ascending']])
//     .exec(function (err, list_headertypes) {
//       var theheadertypes = list_headertypes;
        
//       if (err) { return next(err); }
//       // Successful, so render.
//       console.log('in controLLER 44');
//       res.render('adminpage.hbs', { list_headertypes:  list_headertypes});
//     });

// };

// // Display list of all Booking_SubTypes.
// exports.booking_subtype_list = function(req, res, next) {

//   console.log('in controLLER');
  
//   Booking_SubType.find()
//     .sort([['name', 'ascending']])
//     .exec(function (err, list_booking_subtypes) {
//       var thebooking_subtypes = list_booking_subtypes;
        
//       if (err) { return next(err); }
//       // Successful, so render.
//       console.log("req.flash('success')="+req.flash('success'));
//       res.render('booking.hbs', { list_headertypes:  list_headertypes, expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
//     });

// };


// Handle bst create on POST.
exports.register_room = [

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.


  (req, res, next) => {
    // confirm that user typed same password twice
    console.log('in register_room req.body.room = '+req.body.room);
  
    if (req.body.room &&
      req.body.code1 &&
      req.body.code1 === req.body.code2) {
  
      var userData = {
        roomCode: req.body.room,
        passcode: req.body.code1
      }
  
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/users/home');
        }
      });
  
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }

  }];

adminPageWithErrors = (errors, res, req) => {
  const errors2 = errors.array();
  let errorsText="";
  // console.log('ABCABC1  err='+stringify(errors2));
  // console.log('ABCABC2  err='+errors2[0].msg);

  for (var i = 0, len = errors2.length; i < len; i++) {
    errorsText = errorsText + errors2[i].msg+". ";
  }    
  req.flash('error', 'Ooops, ' + errorsText);
  res.redirect('/admin/infoforadmin');
}

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

// Handle bt create on POST.
exports.headertype_create_post = [

  // Validate that the name field is not empty.
  check('name', 'Name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
      
      const errors = validationResult(req);

      if (!errors.isEmpty()) {

        adminPageWithErrors(errors, res, req);

      } else {

        console.log("type="+req.body.name);
        var bt = new HeaderType(
          { name: req.body.name }
        );
  
        bt.save(function (err) {
          if (err) {
            return next(err); 
          }
          // Success 
          req.flash('success', 'Successfully created a new Header type: ' + req.body.name.toUpperCase());

          // req.session.room_code = "520";

          // req.session.sessionFlash = {
          //   type: 'success',
          //   message: 'This is a flash message using custom middleware and express-session.'
          // }

          //console.log("flash= Successfuly created event! 11");
          //console.log("from system = " + req.flash('success'));
          res.redirect('/admin/infoforadmin');
        });
      }
  }];




// Handle bst create on POST.
exports.booking_subtype_create_post = [

  // Validate that the name field is not empty.
  check('subname', 'Sub-name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  check('infotype').custom((infotype, { req }) => {
    if (infotype == "themessage" || infotype == "webpage") {
      if (req.body.msg.length<3) return Promise.reject('Message is required. Min. length = 3');
    }
    return Promise.resolve('valid');
  }),

  check('infotype').custom((infotype, { req }) => {
    if ( infotype == "webpage" ) {
      if (req.body.url.length>0 && !isURL(req.body.url)) return Promise.reject('Webpage is not valid');
      if (req.body.url.length==0) return Promise.reject('Webpage is required');
    }
    return Promise.resolve('valid');
  }),
  
  check('actionmsg', 'Action message is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      adminPageWithErrors(errors, res, req);

    } else {

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
        req.flash('success', 'Successfully created a new Booking sub-type: ' + req.body.subname.toUpperCase());
        res.redirect('/admin/infoforadmin');
      });
    }
  }];



  // Handle sst create on POST.
exports.sell_subtype_create_post = [

  // Validate that the name field is not empty.
    // Validate that the name field is not empty.
    check('subname', 'Sub-name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

    check('infotype').custom((infotype, { req }) => {
      if (infotype == "themessage" || infotype == "webpage") {
        if (req.body.msg.length<3) return Promise.reject('Message is required. Min. length = 3');
      }
      return Promise.resolve('valid');
    }),
  
    check('infotype').custom((infotype, { req }) => {
      if ( infotype == "webpage" ) {
        if (req.body.url.length>0 && !isURL(req.body.url)) return Promise.reject('Webpage is not valid');
        if (req.body.url.length==0) return Promise.reject('Webpage is required');
      }
      return Promise.resolve('valid');
    }),
    
    check('actionmsg', 'Action message is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),
  
  (req, res, next) => {

    // var name = HeaderType.findOne({ '_id': req.params.id })
    //             .exec( function(err, found_bt) {
    //                  if (err) { return next(err); }

    //                  return found_bt;
    //              });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      adminPageWithErrors(errors, res, req);

    } else {

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
        req.flash('success', 'Successfully created a new Sell sub-type: ' + req.body.subname.toUpperCase());
        res.redirect('/admin/infoforadmin');
      });
    }

  }];



// Handle ist create on POST.
exports.info_subtype_create_post = [

  // Validate that the name field is not empty.
  check('subname', 'Sub-name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  check('infotype').custom((infotype, { req }) => {
    if (infotype == "themessage" || infotype == "webpage") {
      if (req.body.msg.length<3) return Promise.reject('Message is required. Min. length = 3');
    }
    return Promise.resolve('valid');
  }),

  check('infotype').custom((infotype, { req }) => {
    if ( infotype == "webpage" ) {
      if (req.body.url.length>0 && !isURL(req.body.url)) return Promise.reject('Webpage is not valid');
      if (req.body.url.length==0) return Promise.reject('Webpage is required');
    }
    return Promise.resolve('valid');
  }),
  
  check('actionmsg', 'Action message is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      adminPageWithErrors(errors, res, req);

    } else {

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
        req.flash('success', 'Successfully created a new Info sub-type: ' + req.body.subname.toUpperCase());
        res.redirect('/admin/infoforadmin');
      });
    }

  }];


  // Handle BT update on POST.
exports.headertype_update_post = [
   
  // Validate that the name field is not empty.
  check('name', 'Name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      adminPageWithErrors(errors, res, req);

    } else {
      var bt = new HeaderType(
        {
        name: req.body.name,
        _id: req.params.id
        }
      );

      console.log("IIIDD="+req.params.id);
      console.log("NNNAme="+req.body.name);

          HeaderType.findByIdAndUpdate(req.params.id, bt, {}, function (err,cback) {
              if (err) { return next(err); }
                 // Successful - redirect to genre detail page.
                 req.flash('success', 'Successfully updated Header type: ' + req.body.name.toUpperCase());
                 res.redirect('/admin/infoforadmin');
              });
    }
  }
];
  



// Handle SBT update on POST.
  exports.booking_subtype_update_post = [
   
  // Validate that the name field is not empty.
  check('subname', 'Sub-name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  check('infotype').custom((infotype, { req }) => {
    if (infotype == "themessage" || infotype == "webpage") {
      if (req.body.msg.length<3) return Promise.reject('Message is required. Min. length = 3');
    }
    return Promise.resolve('valid');
  }),

  check('infotype').custom((infotype, { req }) => {
    if ( infotype == "webpage" ) {
      if (req.body.url.length>0 && !isURL(req.body.url)) return Promise.reject('Webpage is not valid');
      if (req.body.url.length==0) return Promise.reject('Webpage is required');
    }
    return Promise.resolve('valid');
  }),
  
  check('actionmsg', 'Action message is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
  
        adminPageWithErrors(errors, res, req);
  
      } else {
        var sbt = new Booking_SubType({ 
          _id: req.params.id,
          parent:req.params.parent_id,
          subname: req.body.subname,
          infotype : req.params.infotype,
          message : req.body.msg,
          infowebpage : req.body.url,
          actionmsg : req.body.actionmsg

        });
  
            Booking_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
                if (err) { return next(err); }
                req.flash('success', 'Successfully updated Booking sub-type: ' + req.body.subname.toUpperCase());
                res.redirect('/admin/infoforadmin');
              });
      }
    }
  ];





  // Handle SST update on POST.
  exports.sell_subtype_update_post = [
   
  // Validate that the name field is not empty.
  check('subname', 'Sub-name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  check('infotype').custom((infotype, { req }) => {
    if (infotype == "themessage" || infotype == "webpage") {
      if (req.body.msg.length<3) return Promise.reject('Message is required. Min. length = 3');
    }
    return Promise.resolve('valid');
  }),

  check('infotype').custom((infotype, { req }) => {
    if ( infotype == "webpage" ) {
      if (req.body.url.length>0 && !isURL(req.body.url)) return Promise.reject('Webpage is not valid');
      if (req.body.url.length==0) return Promise.reject('Webpage is required');
    }
    return Promise.resolve('valid');
  }),
  
  check('actionmsg', 'Action message is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

    (req, res, next) => {
  
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
  
        adminPageWithErrors(errors, res, req);
  
      } else {
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
  
            Sell_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                req.flash('success', 'Successfully updated Sell sub-type: ' + req.body.subname.toUpperCase());
                res.redirect('/admin/infoforadmin');
              });
      }
    }
  ];





  // Handle SBT update on POST.
  exports.info_subtype_update_post = [
   
  // Validate that the name field is not empty.
  check('subname', 'Sub-name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  check('infotype').custom((infotype, { req }) => {
    if (infotype == "themessage" || infotype == "webpage") {
      if (req.body.msg.length<3) return Promise.reject('Message is required. Min. length = 3');
    }
    return Promise.resolve('valid');
  }),

  check('infotype').custom((infotype, { req }) => {
    if ( infotype == "webpage" ) {
      if (req.body.url.length>0 && !isURL(req.body.url)) return Promise.reject('Webpage is not valid');
      if (req.body.url.length==0) return Promise.reject('Webpage is required');
    }
    return Promise.resolve('valid');
  }),
  
  check('actionmsg', 'Action message is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
  
        adminPageWithErrors(errors, res, req);
  
      } else {
        var sbt = new Info_SubType({ 
          _id: req.params.id,
          parent:req.params.parent_id,
          subname: req.body.subname,
          infotype : req.params.infotype,
          message : req.body.msg,
          infowebpage : req.body.url,
          actionmsg : req.body.actionmsg
        });
  
            Info_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
               req.flash('success', 'Successfully updated Info sub-type: ' + req.body.subname.toUpperCase());
               res.redirect('/admin/infoforadmin');
            });
      }
    }
  ];



// Handle Genre delete on POST.
exports.headertype_delete_post = function(req, res, next) {

  async.parallel({
      headertype: function(callback) {
          HeaderType.find({ '_id': req.params.id }).exec(callback);
      },
      booking_subtypes: function(callback) {
          Booking_SubType.find({ 'parent': req.params.id }).exec(callback);
      },
      sell_subtypes: function(callback) {
          Sell_SubType.find({ 'parent': req.params.id }).exec(callback);
      },
      info_subtypes: function(callback) {
          Info_SubType.find({ 'parent': req.params.id }).exec(callback);
      },

}, function(err, results) {
      console.log("headertype = "+stringify(results.headertype));
      console.log("headertype[0].name = "+results.headertype[0].name);
      if (err) { return next(err); }
      // Success
      if (results.booking_subtypes.length > 0 || results.sell_subtypes.length > 0 || results.info_subtypes.length > 0) {
          // Genre has books. Render in same way as for GET route.
          req.flash('error', 'Can not delete the Header type of ' + results.headertype[0].name.toUpperCase()+' - it has existing sub-type(s)');
          res.redirect('/admin/infoforadmin');
 }
      else {
          // Genre has no books. Delete object and redirect to the list of genres.
          HeaderType.findByIdAndRemove(req.body.id, function deleteHeader(err) {
              if (err) { return next(err); }
              // Success - go to genres list.
              req.flash('success', 'Header type of ' + results.headertype[0].name.toUpperCase()+' has been deleted !');
              res.redirect('/admin/infoforadmin');
          });
      }
  });
};

// Handle SBT delete on POST.
exports.booking_subtype_delete_post = function(req, res, next) {

  async.parallel({
      booking_subtype: function(callback) {
          Booking_SubType.find({ '_id': req.params.id }).exec(callback);
      },
      users_bookings: function(callback) {
          Users_Booking.find({ 'bookingID': req.params.id }).exec(callback);
      },
      users_buys: function(callback) {
          Users_Buy.find({ 'buyID': req.params.id }).exec(callback);
      },

  }, function(err, results) {
      if (err) { return next(err); }
      // Success
      if (results.users_bookings.length > 0 || results.users_buys.length > 0 ) {
          req.flash('error', 'Can not delete the Booking sub-type of ' + results.booking_subtype[0].subname.toUpperCase()+' - it has existing users bookings');
          res.redirect('/admin/infoforadmin');
  }
      else {
        Booking_SubType.findByIdAndRemove(req.body.id, function deleteBookingSubType(err) {
              if (err) { return next(err); }
              // Success - go to genres list.
              req.flash('success', 'Booking sub-type of ' + results.booking_subtype[0].subname.toUpperCase()+' has been deleted !');
              res.redirect('/admin/infoforadmin');
          });
      }
  });
};

// Handle SBT delete on POST.
exports.sell_subtype_delete_post = function(req, res, next) {

  async.parallel({
      sell_subtype: function(callback) {
          Sell_SubType.find({ '_id': req.params.id }).exec(callback);
      },
      users_bookings: function(callback) {
          Users_Booking.find({ 'bookingID': req.params.id }).exec(callback);
      },
      users_buys: function(callback) {
          Users_Buy.find({ 'buyID': req.params.id }).exec(callback);
      },

  }, function(err, results) {
      if (err) { return next(err); }
      // Success
      if (results.users_bookings.length > 0 || results.users_buys.length > 0 ) {
          req.flash('error', 'Can not delete the Sell sub-type of ' + results.sell_subtype[0].subname.toUpperCase()+' - it has existing users buys');
          res.redirect('/admin/infoforadmin');
  }
      else {
        Sell_SubType.findByIdAndRemove(req.body.id, function deleteSellSubType(err) {
              if (err) { return next(err); }
              // Success - go to genres list.
              req.flash('success', 'Sell sub-type of ' + results.sell_subtype[0].subname.toUpperCase()+' has been deleted !');
              res.redirect('/admin/infoforadmin');
          });
      }
  });
};

// Handle SBT delete on POST.
exports.info_subtype_delete_post = function(req, res, next) {

  async.series({
      info_subtype: function(callback) {
          Info_SubType.find({ '_id': req.params.id }).exec(callback);
      },

  }, function(err, results) {
      if (err) { return next(err); }
      // Success

        Info_SubType.findByIdAndRemove(req.body.id, function deleteInfoSubType(err) {
              if (err) { return next(err); }
              // Success - go to genres list.
              req.flash('success', 'Info sub-type of ' + results.info_subtype[0].subname.toUpperCase()+' has been deleted !');
              res.redirect('/admin/infoforadmin');
        });
  });
};