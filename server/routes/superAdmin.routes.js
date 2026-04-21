const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { requireSuperAdmin } = require("../middlewares/superAdmin.middleware");
const auth = require("../middlewares/authMiddleware");

router.use(auth);
router.use(requireSuperAdmin);

// ── Read ────────────────────────────────────────────
router.get('/admins', adminController.getAdmins);
router.get('/users',  adminController.getUsers);

// ── Create ──────────────────────────────────────────
router.post('/register-admin', adminController.createAdmin);

// ── Update (returns 200 or 202 if email change needs OTP) ──
router.put('/admin/:id', adminController.updateAccount);
router.put('/user/:id',  adminController.updateAccount);

// ── Confirm new email with OTP ───────────────────────
router.post('/admin/:id/confirm-email', adminController.confirmEmailChange);
router.post('/user/:id/confirm-email',  adminController.confirmEmailChange);

// ── Delete ──────────────────────────────────────────
router.delete('/admin/:id', adminController.deleteAdmin);
router.delete('/user/:id',  adminController.deleteUser);

module.exports = router;