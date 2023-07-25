const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const errorMessages = require('../constants/error-messages');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validateSignup, validateSignin } = require('../middlewares/validation');

router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, createUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError(errorMessages.pathNotFound));
});

module.exports = router;
