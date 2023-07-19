const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUserInfo, updateUserInfo,
} = require('../controllers/users');
const { validateUser, validateUserId } = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/me', getCurrentUserInfo);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUser, updateUserInfo);

module.exports = router;
