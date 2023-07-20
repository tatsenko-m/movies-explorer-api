const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const cardRoutes = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Не найдено'));
});

module.exports = router;
