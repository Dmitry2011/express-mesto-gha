const express = require('express');
const bodyParser = require('body-parser');
const { errors, Joi, celebrate } = require('celebrate');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFound = require('./errors/error');
const ErrorNotRecognized = require('./errors/status');
const { regularExpression } = require('./errors/regularExpression');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

// слушаем порт 3000
const { PORT = 3000 } = process.env;
const app = express();

// подключились к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// для собирания JSON-формата
app.use(bodyParser.json());

// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regularExpression),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/', users);
app.use('/', cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errors());

// центральный обработчик ошибок
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(ErrorNotRecognized).send({ message: 'Произошла ошибка' });
  }
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`Приложение слушает порт ${PORT}`);
});
