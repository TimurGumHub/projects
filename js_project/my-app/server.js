// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// Создание экземпляра приложения Express
const app = express();

// Парсер тела запроса
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Разрешение CORS
app.use(cors());

// Подключение к базе данных PostgreSQL
const sequelize = new Sequelize('your_database', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'postgres',
});

// Определение модели Contact
const Contact = sequelize.define('Contact', {
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Создание таблицы в базе данных (если она не существует)
Contact.sync();

// Обработка запроса на получение списка контактов
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Обработка запроса на создание нового контакта
app.post('/api/contacts', async (req, res) => {
  try {
    const { phoneNumber, name } = req.body;
    const contact = await Contact.create({ phoneNumber, name });
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Обработка запроса на обновление контакта
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { phoneNumber, name } = req.body;
    await Contact.update({ phoneNumber, name }, { where: { id } });
    res.json({ message: 'Contact updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Обработка запроса на удаление контакта
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.destroy({ where: { id } });
    res
