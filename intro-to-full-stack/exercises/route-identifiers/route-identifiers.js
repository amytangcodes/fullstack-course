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

/*
    
*/
