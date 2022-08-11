const Card = require('../models/card');
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
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(ErrorNotFound).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      }
      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => res.status(Сreated).send(deletedCard))
        .catch(next);
    })
    .catch(() => {
      res.status(errorNotRecognized).send({ message: 'Произошла ошибка' });
    });
};

  // Поставить лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => res.status(Сreated).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ErrorValid).send({
        message: 'Переданы некорректные данные для постановки лайка.',
      });
    } else if (err.name === 'NotFound') {
      res.status(ErrorNotFound).send({
        message: 'Передан несуществующий _id карточки.',
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
  .then((card) => res.status(Сreated).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ErrorValid).send({
        message: 'Переданы некорректные данные для постановки лайка.',
      });
    } else if (err.name === 'NotFound') {
      res.status(ErrorNotFound).send({
        message: 'Передан несуществующий _id карточки.',
      });
    } else {
      res.status(errorNotRecognized).send({ message: 'Произошла ошибка.' });
    }
  });
};
