const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const errorMessages = require('../constants/error-messages');

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError(errorMessages.pathNotFound));
});

module.exports = router;
