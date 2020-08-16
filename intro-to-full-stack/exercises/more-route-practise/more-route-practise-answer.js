'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const router = express.Router();

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

router.route('/')
  .get((req, res) => {
    res.json({
      data: users
    });
  })
  .post((req, res) => {
    const { user } = req.body;

    user.id = uuid();

    users.push(user);

    res.status(201).send({
      data: [user]
    });
  })

router.route('/:identifier')
  .get((req, res) => {
    const { identifier } = req.params;
    const [user] = users.filter((user) => user.id === identifier);

    res.json({
      data: [user],
    });
  })
  .delete((req, res) => {
    const { identifier } = req.params;

    const nextUsers = users.filter((user) => user.id !== identifier);
    users = nextUsers;

    res.send(204);
  });


app.use('/api/v1/users', router);

app.listen(5000, () => {
  console.log('more-route-practise-answer is running...');
});