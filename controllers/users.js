const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { createToken } = require('../utils/jwt');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unathorized-err');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => {
      return res
        .status(201)
        .send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Такой e-mail уже используется.'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (!passwordMatch) {
          return next(new UnauthorizedError('Неправильные почта или пароль'));
        }
        const token = createToken(user._id);
        return res.status(200).send(token);
      });
      return false;
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => { return res.status(200).send(data); })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const currentUser = req.user.id.toString();
  return User.findById(currentUser)
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
      }
      return next(err);
    });
};

const updateUserData = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  login,
  updateUserData,
  updateUserAvatar,
};
