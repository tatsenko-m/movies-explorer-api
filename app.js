require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes/index');
const { validateSignup, validateSignin } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.post('/signin', validateSignin, login);

app.post('/signup', validateSignup, createUser);

app.use(auth);

app.use(router);

app.listen(PORT);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
