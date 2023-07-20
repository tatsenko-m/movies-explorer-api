const router = require('express').Router();
const {
  getCurrentUserInfo, updateUserInfo,
} = require('../controllers/users');
const { validateUser } = require('../middlewares/validation');

router.get('/me', getCurrentUserInfo);

router.patch('/me', validateUser, updateUserInfo);

module.exports = router;
