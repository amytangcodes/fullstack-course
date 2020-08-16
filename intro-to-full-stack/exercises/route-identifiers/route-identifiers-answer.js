'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const app = express();

app.use(bodyParser.json());

let users = [
  {
    id: uuid(),
    name: 'Phil',
  },
  {
    id: uuid(),
    name: 'Bailey',
  },
  {
    id: uuid(),
    name: 'Mary',
  },
  {
    id: uuid(),
    name: 'Samson',
  },
];

app.get('/users', (req, res) => {
  res.json({
    data: users
  });
});

app.get('/users/:identifier', (req, res) => {
  const { identifier } = req.params;
  const [user] = users.filter((user) => user.id === identifier);

  res.json({
    data: [user],
  });
});

app.post('/users', (req, res) => {
  const { user } = req.body;

  user.id = uuid();

  users.push(user);

  res.status(201).send({
    data: [user]
  });
});

app.delete('/users/:identifier', (req, res) => {
  const { identifier } = req.params;

  const nextUsers = users.filter((user) => user.id !== identifier);
  users = nextUsers;

  res.send(204);
});

app.listen(5000, () => {
  console.log('route-identifiers-answer is running...');
});