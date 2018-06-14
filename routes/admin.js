var express = require('express');
var router = express.Router();


var admin_controller = require('../controllers/adminController'); 
//var headertype_controller = require('../controllers/headertypeController'); 


router.post('/registerroom', admin_controller. register_room);

router.get('/headertypes', admin_controller. headertype_list);

router.get('/infoforadmin', admin_controller. admins_list);


router.post('/headertype/save', admin_controller. headertype_create_post);

router.post('/headertype/:id/update', admin_controller.headertype_update_post);

router.post('/headertype/:id/delete', admin_controller.headertype_delete_post);


router.post('/booking_subtype/:parent_id/:infotype/save', admin_controller.booking_subtype_create_post);

router.post('/booking_subtype/:id/:parent_id/:infotype/update', admin_controller.booking_subtype_update_post);

router.post('/booking_subtype/:id/delete', admin_controller.booking_subtype_delete_post);


router.post('/sell_subtype/:parent_id/:infotype/save', admin_controller.sell_subtype_create_post);

router.post('/sell_subtype/:id/:parent_id/:infotype/update', admin_controller.sell_subtype_update_post);


router.post('/info_subtype/:parent_id/:infotype/save', admin_controller.info_subtype_create_post);

router.post('/info_subtype/:id/:parent_id/:infotype/update', admin_controller.info_subtype_update_post);


module.exports = router;
