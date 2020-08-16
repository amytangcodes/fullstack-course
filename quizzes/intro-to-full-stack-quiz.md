# Quiz

## Question 1
> Create an express app to serve `/api/users` using an `express.Router` instance.

> GET `/api/users`: returns list of al users

> GET `/api/users/:id`: returns a single user

> POST `/api/users`: creates a user

  Payload Structure
  ```json
    {
      "name": "Drew"
    }
  ```

```javascript
'use strict';

const express = require('express');
const uuid = require('uuid/v4');

const app = express();

const users = [
  {
    id: '1c066fdc9-5f6f-4e05-8d4c-66dd73d3210e',
    name: 'Phil',
  },
  {
    id: '50bf253d-a758-445e-b597-80146a5604b0',
    name: 'Mary',
  },
  {
    id: 'ac99815f-1d56-4ab4-8630-a31045f61401',
    name: 'Bailey',
  },
  {
    id: 'f1fcbc30-6669-4438-9db3-e0fd9e028d96',
    name: 'Harper',
  }
];

app.listen(6000, () => {
  console.log('Quiz Question 1: is running...');
});
```


## Question 2
> Version the above API to handle requests from `/api/v1/users` and `/api/v2/users`. Version 2 of the API should send back the following:

```json
{
  "id": "ac99815f-1d56-4ab4-8630-a31045f61401",
  "firstName": "Bailey"
}
```

##### The challenge is to support both API versions

```javascript
'use strict';

const express = require('express');
const uuid = require('uuid/v4');

const app = express();

const users = [
  {
    id: '1c066fdc9-5f6f-4e05-8d4c-66dd73d3210e',
    name: 'Phil',
  },
  {
    id: '50bf253d-a758-445e-b597-80146a5604b0',
    name: 'Mary',
  },
  {
    id: 'ac99815f-1d56-4ab4-8630-a31045f61401',
    name: 'Bailey',
  },
  {
    id: 'f1fcbc30-6669-4438-9db3-e0fd9e028d96',
    name: 'Harper',
  }
];

app.listen(6000, () => {
  console.log('Quiz Question 1: is running...');
});
```
