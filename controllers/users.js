const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch(() => {
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.status(200).send(user);
    })
    .catch(() => {
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const updateUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      }
      return res.status(500).send({ message: "Ошибка сервера" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserData,
  updateUserAvatar,
};