require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const config = require('./constants/config');

const { PORT = 3000, DB_URL = config.dataBaseUrl } = process.env;

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(router);

app.listen(PORT);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
