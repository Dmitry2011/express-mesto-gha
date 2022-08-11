const cardRouter = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

  // создаёт карточку
cardRouter.post('/cards', createCard);

  // возвращает все карточки
cardRouter.get('/cards', getCards);

  // удаляет карточку по идентификатору
cardRouter.delete('/cards/:cardId', deleteCard);

  // поставить лайк карточке
cardRouter.put('/cards/:cardId/likes', likeCard);

  // убрать лайк с карточки
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRouter;
