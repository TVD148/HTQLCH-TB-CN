const router = require('express').Router();
const { register, login, getMe, updateProfile, changePassword, registerValidation, loginValidation } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', registerValidation, register);
router.post('/login',    loginValidation,    login);
router.get('/me',        verifyToken,        getMe);
router.put('/profile',   verifyToken,        updateProfile);
router.put('/change-password', verifyToken,  changePassword);

module.exports = router;
