const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cardRouter = require('./routes/cards');

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

app.use((req, res, next) => {
  req.user = {
    _id: '62f3985d5382c634623a8854',
  };
  next();
});

app.use('/', users);
app.use('/', cardRouter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`Приложение слушает порт ${PORT}`);
});
