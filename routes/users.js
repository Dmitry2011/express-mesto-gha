const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/users', getUsers);

// возвращает текущего пользователя
router.get('/users/me', getCurrentUser);

// возвращает пользователя по _id
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

// обновляет профиль
router.patch('/users/me', updateUser);

// обновляет аватар
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
