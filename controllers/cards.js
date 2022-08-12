const Card = require('../models/card');
const NotFound = require('../errors/error');
const {
  ErrorValid, ErrorNotFound, Сreated, errorNotRecognized,
} = require('../errors/status');

  // Создание новой карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(Сreated).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorValid).send({
          message: 'Переданы некорректные данные при создании карточки. ',
        });
      } else {
        res.status(errorNotRecognized).send({ message: 'Произошла ошибка' });
      }
  });
};

  // Получение карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(Сreated).send(cards))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(errorNotRecognized).send({
          message: 'Произошла ошибка',
        });
      }
  });
};

  // Удаление карточки
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorValid).send({
          message: 'Переданы некорректные данные.',
        });
      } else if (err.name === 'NotFound') {
        res.status(ErrorNotFound).send({
          message: 'Карточка с указанным id не найдена.',
        });
      } else {
        res.status(errorNotRecognized).send({ message: 'Произошла ошибка' });
      }
    });
};

  // Поставить лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .orFail(() => {
    throw new NotFound();
  })
  .then((card) => res.status(Сreated).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ErrorValid).send({
        message: 'Переданы некорректные данные для постановки лайка.',
      });
    } else if (err.name === 'NotFound') {
      res.status(ErrorNotFound).send({
        message: 'Передан несуществующий id карточки.',
      });
    } else {
      res.status(errorNotRecognized).send({ message: 'Произошла ошибка.' });
    }
  });
};

  // Удалить лайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail(() => {
    throw new NotFound();
  })
  .then((card) => res.status(Сreated).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ErrorValid).send({
        message: 'Переданы некорректные данные для постановки лайка.',
      });
    } else if (err.name === 'NotFound') {
      res.status(ErrorNotFound).send({
        message: 'Передан несуществующий id карточки.',
      });
    } else {
      res.status(errorNotRecognized).send({ message: 'Произошла ошибка.' });
    }
  });
};
