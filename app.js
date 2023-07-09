/* eslint-disable no-useless-escape */
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const routes = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const authorize = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('db connected');
  });

const app = express();
app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9-\._~:\/\?#[\]@!\$&'()\*\+,;=]{2,256}\.[a-z]{2,4}\b([a-zA-Z0-9-\._~:\/\?#[\]@!\$&'()\*\+,;=]*)/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }).unknown(true),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }).unknown(true),
}), login);

app.use(authorize);
app.use(routes);

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Указанная страница не существует.'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
