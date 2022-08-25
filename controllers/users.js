const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/error');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

const {
  ErrorValid, ErrorNotFound, ErrorNotRecognized,
} = require('../errors/status');

// создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  // проверка, существует ли такой же email
  return User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictError(`Пользователь ${email} уже существует.`));
    }

    // хешируем пароль
    return bcrypt.hash(password, 10);
  })

    .then((hash) => User.create({
      email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены не корректные данные.'));
      }
      return next(err);
    });
};

// аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user || !password) {
        return next(new BadRequestError('Неверный email или пароль.'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        {
          expiresIn: '7d',
        },
      );

      return res.send({ token });
    })
    .catch(next);
};

// возвращаем информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    if (!user) {
      return next(new NotFound('Пользователь не найден.'));
    }

    return res.send(user);
  }).catch(next);
};

// получение пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ErrorNotRecognized).send({ message: 'Произошла ошибка' }));
};

// получение пользователя по его id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ErrorNotFound).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else if (err.name === 'CastError') {
        res.status(ErrorValid).send({
          message: 'Задан не некорректный id.',
        });
      } else {
        res.status(ErrorNotRecognized).send({ message: 'Произошла ошибка' });
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorValid).send({
          message: 'Переданы некорректные данные пользователя.',
        });
      } else {
        res.status(ErrorNotRecognized).send({ message: 'Произошла ошибка' });
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorValid).send({
          message: 'Переданы некорректные данные, нужна ссылка.',
        });
      } else {
        res.status(ErrorNotRecognized).send({ message: 'Произошла ошибка' });
      }
    });
};
