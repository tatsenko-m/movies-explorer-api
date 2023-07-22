const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const errorMessages = require('../constants/error-messages');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.validationFailed));
      } else {
        next(err);
      }
    });
};

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(errorMessages.movieNotFound));
      }
      if (String(req.user._id) !== String(movie.owner)) {
        return next(new ForbiddenError(errorMessages.noAccess));
      }
      return Movie.findByIdAndRemove(req.params._id)
        .then((deletedMovie) => res.status(200).send(deletedMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.invalidId));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
