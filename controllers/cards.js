const Card = require('../models/card');
const NotFound = require('../errors/error');
const ForbiddenError = require('../errors/error');
const BadRequestError = require('../errors/badRequestError');
const {
  ErrorValid, ErrorNotFound, ErrorNotRecognized,
} = require('../errors/status');

// Создание новой карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

// Получение карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена.');
      }
      if (card.owner.valueOf() !== _id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку!');
      }
      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => res.status(200).send(deletedCard))
        .catch(next);
    })
    .catch(next);
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
    .then((card) => res.send(card))
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
        res.status(ErrorNotRecognized).send({ message: 'Произошла ошибка.' });
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
    .then((card) => res.send(card))
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
        res.status(ErrorNotRecognized).send({ message: 'Произошла ошибка.' });
      }
    });
};
