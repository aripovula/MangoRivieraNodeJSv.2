const moment = require('moment');

const HeaderType = require('../models/headertype');
const Booking_SubType = require('../models/booking_subtype');
const Sell_SubType = require('../models/sell_subtype');
const Info_SubType = require('../models/info_subtype');
const Users_Booking = require('../models/users_booking');
const Users_Buy = require('../models/users_buy');
const User = require('../models/user');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');

// const Book = require('../models/book');
const async = require('async');
const stringify = require('json-stringify');

const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all HeaderTypes.

exports.list_4home = function(req, res, next) {
  async.series([
    function(callback){
      HeaderType.find({}).sort([['sequence', 'ascending']]).exec(callback);
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
  ], function(err, results){
      if (results[4] == null) {
        res.redirect('/users/homelocked'); 
      } else {
        res.render('home.hbs',{
          list_headertypes: results[0],
          list_booking_subtypes: results[1],
          list_sell_subtypes: results[2],
          list_info_subtypes: results[3],
          for_tables: [ results[0] , [results[1], results[2], results[3] ] ],
          room_n: results[4].roomCode
      });
     }
  });
}

exports.list_4home_locked = function(req, res, next) {
  async.series([
    function(callback){
      HeaderType.find({}).sort([['sequence', 'ascending']]).exec(callback);
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
  ], function(err, results){
      res.render('homelocked.hbs',{
        list_headertypes: results[0],
        list_booking_subtypes: results[1],
        list_sell_subtypes: results[2],
        list_info_subtypes: results[3],
        for_tables: [ results[0] , [results[1], results[2], results[3] ] ]
    });
  });
}

exports.list_4book = function(req, res, next) {
  async.series([
    function(callback){
      HeaderType.find({}).sort([['sequence', 'ascending']]).exec(callback);
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
      Booking_SubType.findOne({'_id': req.params.bookingID}).populate('parent').sort([['subname', 'ascending']]).exec(callback);
    },
    function(callback){
      User.findById(req.session.userId).exec(callback);
    },
  ], function(err, results){
      if (results[5] == null) {
        res.redirect('/users/homelocked'); 
      } else {
        res.render('bookform.hbs',{
          list_headertypes: results[0],
          list_booking_subtypes: results[1],
          list_sell_subtypes: results[2],
          list_info_subtypes: results[3],
          selected_booktype: results[4],
          //bookingID:req.params.buyID,
          for_tables: [ results[0] , [results[1], results[2], results[3] ] , req.params.bookingID ],
          room_n: results[5].roomCode,
          expressFlash: req.flash('success'), 
          expressFailureFlash: req.flash('error')

        });
      }
  });
}

exports.list_4buy = function(req, res, next) {
  async.series([
    function(callback){
      HeaderType.find({}).sort([['sequence', 'ascending']]).exec(callback);
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
  ], function(err, results){
      if (results[4] == null) {
        res.redirect('/users/homelocked'); 
      } else {
        res.render('buyform.hbs',{
          list_headertypes: results[0],
          list_booking_subtypes: results[1],
          list_sell_subtypes: results[2],
          list_info_subtypes: results[3],
          for_tables: [ results[0] , [results[1], results[2], results[3] ] , req.params.buyID ],
          for_buyform: '[{"sel_id":"'+req.params.buyID+'"},'+stringify(results[2])+"]" ,
          room_n: results[4].roomCode,
          expressFlash: req.flash('success'), 
          expressFailureFlash: req.flash('error')

      });
    }
  });
}


exports.list_4info = function(req, res, next) {
  async.series([
    function(callback){
      HeaderType.find({}).sort([['sequence', 'ascending']]).exec(callback);
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
      Info_SubType.findOne({'_id': req.params.infoID}).populate('parent').sort([['subname', 'ascending']]).exec(callback);
    },
    function(callback){
      User.findById(req.session.userId).exec(callback);
    },
  ], function(err, results){
      if (results[5] == null) {
        res.redirect('/users/homelocked'); 
      } else {
        res.render('infoform.hbs',{
          list_headertypes: results[0],
          list_booking_subtypes: results[1],
          list_sell_subtypes: results[2],
          list_info_subtypes: results[3],
          sel_info: results[4],
          infoID:req.params.infoId,
          for_tables: [ results[0] , [results[1], results[2], results[3] ] , req.params.buyID ],
          room_n: results[5].roomCode
        });
      }
    });
}

exports.list_4guest = function(req, res, next) {

  async.series([
    function(callback){
      HeaderType.find({}).sort([['sequence', 'ascending']]).exec(callback);
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
    function(callback){
      Users_Booking.find({'userID': req.session.userId}).sort([['date', 'ascending']]).exec(callback);
    },
    function(callback){
      Users_Buy.find({'userID': req.session.userId}).sort([['date', 'ascending']]).exec(callback);
    },
  ], function(err, results){
      if (results[4] == null) {
        res.redirect('/users/homelocked'); 
      } else {
        res.render('guestsummary.hbs',{
          list_headertypes: results[0],
          list_booking_subtypes: results[1],
          list_sell_subtypes: results[2],
          list_info_subtypes: results[3],
          for_tables: [ results[0] , [results[1], results[2], results[3] ] ],
          room_n: results[4].roomCode,
          list_bookings: results[5],
          list_buys: results[6],
          expressFlash: req.flash('success'), 
          expressFailureFlash: req.flash('error')
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
//       let theheadertypes = list_headertypes;
        
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
//       let thebooking_subtypes = list_booking_subtypes;
        
//       if (err) { return next(err); }
//       // Successful, so render.
//       res.render('booking.hbs', { list_headertypes:  list_headertypes});
//     });

// };

// Handle bst create on POST.
exports.login_room = [

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.


  (req, res, next) => {
    // confirm that user typed same password twice
  
    if (req.body.room && req.body.code1) {

      User.authenticate(req.body.room, req.body.code1, function (error, user) {
        if (error || !user) {
          let err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.redirect('/users/home');
          
        }
      });
    } else {
      let err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }

  }];

// Handle bt create on POST.
// exports.headertype_create_post = [

//   // Validate that the name field is not empty.
//   body('type', 'Type name is required').isLength({ min: 3 }).trim(),

//   // Sanitize (trim and escape) the name field.
//   sanitizeBody('name').trim().escape(),

//   // Process request after validation and sanitization.
//   (req, res, next) => {

//     console.log("type="+req.body.name);
//     let bt = new HeaderType(
//         { name: req.body.name }
//       );
      
//       bt.save(function (err) {
//         if (err) { return next(err); }
//         // Success 
//         // req.flash('success', 'Successfuly created event!');
//         req.flash('success', 'Successfuly created event! 11');
//         //console.log("flash= Successfuly created event! 11");
//         //console.log("from system = " + req.flash('success'));
//         req.session.room_code = "520";
        
//         req.session.sessionFlash = {
//           type: 'success',
//           message: 'This is a flash message using custom middleware and express-session.'
//         }
  
//         res.redirect('/session-flash');
//       });
//   }];


// Handle bst create on POST.
exports.users_booking_create_post = [

  // Since we are using the Bootstrap DateTimePicker there is no need to check validity of Date
  // As long as length is not zero it should be valid date and time
  check('bdate', 'Date is required').isLength({ min: 1 }).escape(),

  check('bstarttime', 'Start time is required').isLength({ min: 1 }).escape(),

  check('bendtime', 'End time is required').isLength({ min: 1 }).escape(),

  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      const errors2 = errors.array();
      let errorsText="";
      // console.log('ABCABC1  err='+stringify(errors2));
      // console.log('ABCABC2  err='+errors2[0].msg);
    
      for (let i = 0, len = errors2.length; i < len; i++) {
        errorsText = errorsText + errors2[i].msg+". ";
      }    
      req.flash('error', 'Ooops, ' + errorsText);
      res.redirect('/users/bookform/'+req.body.bid);
    

    } else {

      console.log("name="+req.body.bname);
      console.log("stime="+req.body.bstarttime);
      console.log("stime2="+req.body.bstarttime2);
      console.log("date="+req.body.bdate);
      console.log("date2="+req.body.bdate2);
      let date = req.body.bdate;
      let TimeStart = req.body.bstarttime;
      let datePlusTimeStart = req.body.bdate+" "+req.body.bstarttime;
      let momentDate = moment(datePlusTimeStart, 'DD MMM YYYY HH:mm:ss');
      let jsDateStart = momentDate.toDate();

      let TimeEnd = req.body.bendtime;
      //let momentDate = moment(datePlusTimeEnd, 'DD MMM YYYY HH:mm');
      //let jsDateEnd = momentDate.toString();

      // console.log("name="+name.name);
      let sbt = new Users_Booking({
        bookingID : req.body.bid,
        bookingname : req.body.bname,
        userID : req.session.userId,
        date : jsDateStart,
        dateStr : date,
        starttime : TimeStart,
        endtime   : TimeEnd
      });
        
        sbt.save(function (err) {
          if (err) { return next(err); }
          // Success
          req.flash('success', 'Successfully created a new booking');
          res.redirect('/users/guestsummary');
        });

    }
  }];

// Handle bst create on POST.
exports.users_buy_create_post = [

  // Since we are using the Bootstrap Datepicker there is no need to check validity of Date
  // As long as length is not zero it should be valid date
  check('pdate', 'Date is required').isLength({ min: 1 }).escape(),

  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      const errors2 = errors.array();
      let errorsText="";
      // console.log('ABCABC1  err='+stringify(errors2));
      // console.log('ABCABC2  err='+errors2[0].msg);
    
      for (let i = 0, len = errors2.length; i < len; i++) {
        errorsText = errorsText + errors2[i].msg+". ";
      }    
      req.flash('error', 'Ooops, ' + errorsText);
      res.redirect('/users/buyform/'+req.body.bid);
    

    } else {

      console.log("name="+req.body.bname);
      console.log("date="+req.body.pdate);
      
      let date = req.body.pdate;
      let momentDate = moment(date, 'DD MMM YYYY');
      let jsDate = momentDate.toDate();

      console.log("date="+date);
      console.log("jsDate="+jsDate);

      let sbt = new Users_Buy({ 
        buyID : req.body.bid,
        buyname : req.body.bname,
        date : jsDate,
        dateStr : date,
        userID : req.session.userId,
        price : req.body.bprice,
        qnty : req.body.bqnty[1],
        total : req.body.bqnty[1] * req.body.bprice
      });
        
        sbt.save(function (err) {
          if (err) { return next(err); }
          // Success
          req.flash('success', 'Successfully created a new purchase');
          res.redirect('/users/guestsummary');
        });
      }
  }];



// Handle SBT update on POST.
exports.users_booking_cancel_post = [
   
  // Validate that the name field is not empty.
  // check('subname', 'Sub-name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  // check('infotype').custom((infotype, { req }) => {
  //   if (infotype == "themessage" || infotype == "webpage") {
  //     if (req.body.msg.length<3) return Promise.reject('Message is required. Min. length = 3');
  //   }
  //   return Promise.resolve('valid');
  // }),

  // check('infotype').custom((infotype, { req }) => {
  //   if ( infotype == "webpage" ) {
  //     if (req.body.url.length>0 && !isURL(req.body.url)) return Promise.reject('Webpage is not valid');
  //     if (req.body.url.length==0) return Promise.reject('Webpage is required');
  //   }
  //   return Promise.resolve('valid');
  // }),
  
  // check('actionmsg', 'Action message is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
  
        adminPageWithErrors(errors, res, req);
  
      } else {

          Users_Booking.update({_id: req.params.bookingID}, {$set: {isActive: false}}, function (err,cback) {
            if (err) { return next(err); }
            req.flash('success', 'Selected booking has been cancelled !');
            res.redirect('/users/guestsummary');
          });

            // Booking_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
            //     if (err) { return next(err); }
            //     req.flash('success', 'Successfully updated Booking sub-type: ' + req.body.subname.toUpperCase());
            //     res.redirect('/admin/infoforadmin');
            //   });
      }
    }
  ];


  // Handle SBT update on POST.
exports.users_buy_cancel_post = [
   
  // Validate that the name field is not empty.
  // check('subname', 'Sub-name is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),

  // check('infotype').custom((infotype, { req }) => {
  //   if (infotype == "themessage" || infotype == "webpage") {
  //     if (req.body.msg.length<3) return Promise.reject('Message is required. Min. length = 3');
  //   }
  //   return Promise.resolve('valid');
  // }),

  // check('infotype').custom((infotype, { req }) => {
  //   if ( infotype == "webpage" ) {
  //     if (req.body.url.length>0 && !isURL(req.body.url)) return Promise.reject('Webpage is not valid');
  //     if (req.body.url.length==0) return Promise.reject('Webpage is required');
  //   }
  //   return Promise.resolve('valid');
  // }),
  
  // check('actionmsg', 'Action message is required. Min. length = 3').trim().isLength({ min: 3 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
  
        adminPageWithErrors(errors, res, req);
  
      } else {
          Users_Buy.update({_id: req.params.buyID}, {$set: {isActive: false}}, function (err,cback) {
            if (err) { return next(err); }
            req.flash('success', 'Selected purchase has been cancelled !');
            res.redirect('/users/guestsummary');
          });

            // Booking_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
            //     if (err) { return next(err); }
            //     req.flash('success', 'Successfully updated Booking sub-type: ' + req.body.subname.toUpperCase());
            //     res.redirect('/admin/infoforadmin');
            //   });
      }
    }
  ];


//   // Handle sst create on POST.
// exports.sell_subtype_create_post = [

//   // Validate that the name field is not empty.
//   // body('type', 'Type name required').isLength({ min: 1 }).trim(),

//   // Sanitize (trim and escape) the name field.
//   //sanitizeBody('name').trim().escape(),

//   // Process request after validation and sanitization.


//   (req, res, next) => {

//     // let name = HeaderType.findOne({ '_id': req.params.id })
//     //             .exec( function(err, found_bt) {
//     //                  if (err) { return next(err); }

//     //                  return found_bt;
//     //              });

//     console.log("subname="+req.body.subname);
//     // console.log("name="+name.name);
//     let sbt = new Sell_SubType({ 
//       parent : req.params.parent_id,
//       subname : req.body.subname,
//       infotype : req.params.infotype,
//       message : req.body.msg,
//       infowebpage : req.body.url,
//       actionmsg : req.body.actionmsg,
//       price : req.body.price
//     });
      
//       sbt.save(function (err) {
//         if (err) { return next(err); }
//         // Success
//         req.flash('success', 'Successfuly created event! 11');
//         //console.log("flash= Successfuly created event! 11");
//         //console.log("from system = " + req.flash('success'));
//         res.redirect('/admin/infoforadmin');
//       });


//   }];



// // Handle ist create on POST.
// exports.info_subtype_create_post = [

//   // Validate that the name field is not empty.
//   // body('type', 'Type name required').isLength({ min: 1 }).trim(),

//   // Sanitize (trim and escape) the name field.
//   //sanitizeBody('name').trim().escape(),

//   // Process request after validation and sanitization.


//   (req, res, next) => {

//     // let name = HeaderType.findOne({ '_id': req.params.id })
//     //             .exec( function(err, found_bt) {
//     //                  if (err) { return next(err); }

//     //                  return found_bt;
//     //              });

//     console.log("subname="+req.body.subname);
//     // console.log("name="+name.name);
//     let sbt = new Info_SubType({ 
//       parent : req.params.parent_id,
//       subname : req.body.subname,
//       infotype : req.params.infotype,
//       message : req.body.msg,
//       infowebpage : req.body.url,
//       actionmsg : req.body.actionmsg
//     });
      
//       sbt.save(function (err) {
//         if (err) { return next(err); }
//         // Success
//         req.flash('success', 'Successfuly created event! 11');
//         console.log("flash= Successfuly created event! 11");
//         console.log("from system = " + req.flash('success'));
//         res.redirect('/admin/infoforadmin');
//       });


//   }];


//   // Handle BT update on POST.
// exports.headertype_update_post = [
   
//   // Validate that the name field is not empty.
//   // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
  
//   // Sanitize (trim and escape) the name field.
//   // sanitizeBody('name').trim().escape(),

//   // Process request after validation and sanitization.
//   (req, res, next) => {

      
//       // Extract the validation errors from a request .
//       // const errors = validationResult(req);

//   // Create a genre object with escaped and trimmed data (and the old id!)
//       let bt = new HeaderType(
//         {
//         name: req.body.name,
//         _id: req.params.id
//         }
//       );

//       console.log("IIIDD="+req.params.id);
//       console.log("NNNAme="+req.body.name);

//       // if (!errors.isEmpty()) {
//       //     // There are errors. Render the form again with sanitized values and error messages.
//       //     res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
//       // return;
//       // }
//       // else {
//           // Data from form is valid. Update the record.
//           HeaderType.findByIdAndUpdate(req.params.id, bt, {}, function (err,cback) {
//               if (err) { return next(err); }
//                  // Successful - redirect to genre detail page.
//                  res.redirect('/admin/infoforadmin');
//               });
//       //}
//   }
// ];
  



// // Handle SBT update on POST.
//   exports.booking_subtype_update_post = [
   
//     // Validate that the name field is not empty.
//     // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
//     // Sanitize (trim and escape) the name field.
//     // sanitizeBody('name').trim().escape(),
  
//     // Process request after validation and sanitization.
//     (req, res, next) => {
  
        
//         // Extract the validation errors from a request .
//         // const errors = validationResult(req);
  
//     // Create a genre object with escaped and trimmed data (and the old id!)
//     let sbt = new Booking_SubType({ 
//       _id: req.params.id,
//       parent:req.params.parent_id,
//       subname: req.body.subname,
//       infotype : req.params.infotype,
//       message : req.body.msg,
//       infowebpage : req.body.url,
//       actionmsg : req.body.actionmsg

//     });
  
//         // if (!errors.isEmpty()) {
//         //     // There are errors. Render the form again with sanitized values and error messages.
//         //     res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
//         // return;
//         // }
//         // else {
//             // Data from form is valid. Update the record.
//             Booking_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
//                 if (err) { return next(err); }
//                    // Successful - redirect to genre detail page.
//                    res.redirect('/admin/infoforadmin');
//                 });
//         //}
//     }
//   ];





//   // Handle SST update on POST.
//   exports.sell_subtype_update_post = [
   
//     // Validate that the name field is not empty.
//     // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
//     // Sanitize (trim and escape) the name field.
//     // sanitizeBody('name').trim().escape(),
  
//     // Process request after validation and sanitization.
//     (req, res, next) => {
  
        
//         // Extract the validation errors from a request .
//         // const errors = validationResult(req);
  
//     // Create a genre object with escaped and trimmed data (and the old id!)
//     let sbt = new Sell_SubType({ 
//       _id: req.params.id,
//       parent:req.params.parent_id,
//       subname: req.body.subname,
//       infotype : req.params.infotype,
//       message : req.body.msg,
//       infowebpage : req.body.url,
//       actionmsg : req.body.actionmsg,
//       price : req.body.price

//     });
  
//         // if (!errors.isEmpty()) {
//         //     // There are errors. Render the form again with sanitized values and error messages.
//         //     res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
//         // return;
//         // }
//         // else {
//             // Data from form is valid. Update the record.
//             Sell_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
//                 if (err) { return next(err); }
//                    // Successful - redirect to genre detail page.
//                    res.redirect('/admin/infoforadmin');
//                 });
//         //}
//     }
//   ];





//   // Handle SBT update on POST.
//   exports.info_subtype_update_post = [
   
//     // Validate that the name field is not empty.
//     // body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
//     // Sanitize (trim and escape) the name field.
//     // sanitizeBody('name').trim().escape(),
  
//     // Process request after validation and sanitization.
//     (req, res, next) => {
  
        
//         // Extract the validation errors from a request .
//         // const errors = validationResult(req);
  
//     // Create a genre object with escaped and trimmed data (and the old id!)
//     let sbt = new Info_SubType({ 
//       _id: req.params.id,
//       parent:req.params.parent_id,
//       subname: req.body.subname,
//       infotype : req.params.infotype,
//       message : req.body.msg,
//       infowebpage : req.body.url,
//       actionmsg : req.body.actionmsg

//     });
  
//         // if (!errors.isEmpty()) {
//         //     // There are errors. Render the form again with sanitized values and error messages.
//         //     res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
//         // return;
//         // }
//         // else {
//             // Data from form is valid. Update the record.
//             Info_SubType.findByIdAndUpdate(req.params.id, sbt, {}, function (err,cback) {
//                 if (err) { return next(err); }
//                    // Successful - redirect to genre detail page.
//                    res.redirect('/admin/infoforadmin');
//                 });
//         //}
//     }
//   ];



// // Handle Genre delete on POST.
// exports.headertype_delete_post = function(req, res, next) {

//   async.parallel({
//       bt: function(callback) {
//         HeaderType.findById(req.params.id).exec(callback);
//       },
//       genre_books: function(callback) {
//           Book.find({ 'genre': req.params.id }).exec(callback);
//       },
//   }, function(err, results) {
//       if (err) { return next(err); }
//       // Success
//       if (results.genre_books.length > 0) {
//           // Genre has books. Render in same way as for GET route.
//           res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
//           return;
//       }
//       else {
//           // Genre has no books. Delete object and redirect to the list of genres.
//           Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
//               if (err) { return next(err); }
//               // Success - go to genres list.
//               res.redirect('/admin/infoforadmin');
//           });
//       }
//   });
// };

// // Handle SBT delete on POST.
// exports.booking_subtype_delete_post = function(req, res, next) {

//   async.parallel({
//       bt: function(callback) {
//         HeaderType.findById(req.params.id).exec(callback);
//       },
//       genre_books: function(callback) {
//           Book.find({ 'genre': req.params.id }).exec(callback);
//       },
//   }, function(err, results) {
//       if (err) { return next(err); }
//       // Success
//       if (results.genre_books.length > 0) {
//           // Genre has books. Render in same way as for GET route.
//           res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
//           return;
//       }
//       else {
//           // Genre has no books. Delete object and redirect to the list of genres.
//           Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
//               if (err) { return next(err); }
//               // Success - go to genres list.
//               res.redirect('/admin/infoforadmin');
//           });
//       }
//   });
// };


// LOG OUT
exports.log_out = [

  // Validate that the name field is not empty.
  // body('type', 'Type name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  //sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.


  (req, res, next) => {
    
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          console.log('Logged out');
          return res.redirect('/');
        }
      });
    }
  }];