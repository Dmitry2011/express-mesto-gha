const User = require('../models/user');
const NotFound = require('../errors/error');
const {
  ErrorValid, Сreated, ErrorNotFound, errorNotRecognized,
} = require('../errors/status');

  // создание нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then((user) => res.status(Сreated).send({
    user,
  }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ErrorValid).send({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    } else {
      res.status(errorNotRecognized).send({ message: 'Произошла ошибка' });
    }
});
};

  // получение пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(Сreated).send(users))
    .catch(() => res.status(errorNotRecognized).send({ message: 'Произошла ошибка' }));
};

  // получение пользователя по его id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(Сreated).send({ user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ErrorValid).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else {
        res.status(errorNotRecognized).send({ message: 'Произошла ошибка' });
      }
    });
};

  // обновление информации о пользователе
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(Сreated).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorValid).send({
          message: 'Переданы некорректные данные пользователя.',
        });
      } else {
        res.status(errorNotRecognized).send({ message: 'Произошла ошибка' });
      }
    });
};

  // обновление аватара пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(Сreated).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorValid).send({
          message: 'Переданы некорректные данные, нужна ссылка.',
        });
      } else {
        res.status(errorNotRecognized).send({ message: 'Произошла ошибка' });
      }
    });
};
