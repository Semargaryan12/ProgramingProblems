const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const {requireSuperAdmin} = require("../middlewares/superAdmin.middleware")
const auth = require("../middlewares/authMiddleware");

router.use(auth);
router.use(requireSuperAdmin);

router.get('/admins', adminController.getAdmins);
router.get('/users', adminController.getUsers); // Added

router.post('/register-admin', adminController.createAdmin);

router.put('/admin/:id', adminController.updateAccount); // Added
router.put('/user/:id', adminController.updateAccount);  // Added

router.delete('/admin/:id', adminController.deleteAdmin);
router.delete('/user/:id', adminController.deleteUser);   // Added
module.exports = router;