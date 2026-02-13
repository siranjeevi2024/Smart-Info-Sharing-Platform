const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  blockUser,
  deleteUser,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.get('/dashboard', getDashboardStats);
router.put('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);

module.exports = router;