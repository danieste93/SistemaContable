const express = require('express');
const router = express.Router()
const userController = require('../controler/usercontrol');
const Authentication = require("../controler/middleware/auth")

router.post('/register', userController.create);

router.post('/googleLogin', userController.googleLogin);


router.post('/register-seller',Authentication, userController.registerSeller);
router.post('/register-autoclient', userController.registerSeller);
router.post('/update-seller',Authentication, userController.updateBySeller);
router.post('/update-cuentaid',Authentication, userController.updateCuentaid);

router.post('/register-distri',Authentication, userController.registerDistri);
router.post('/edit-distri',Authentication, userController.editDistri);
router.post('/uploadarrorder',Authentication, userController.uploadArrorder);


router.post('/checkfbdata', userController.checkFBdata);

router.post('/authenticate', userController.authenticate);
router.post('/authenticateclient', userController.authenticateClient);
router.post('/coins', userController.getUserCoins);
router.put('/update', userController.update);
router.post('/getuserdata', userController.getUserData);
router.post('/delete', userController.deleteUser);
router.get('/logout', userController.logOut);
router.put('/addpurchase', userController.addpurchase);
router.put('/updatepay', userController.updatepayment);
router.put('/updatecoins', userController.updateUserCoins);

router.put('/addrequest', userController.addrequest);
router.put('/updaterep', userController.updaterep);
router.put('/activator', userController.activator);
router.post('/resetpassword', userController.resetpassword);
router.post('/confirmResetPassword',  userController.confirmResetPassword);

router.get('/get-users', userController.getUsers);

module.exports = router;