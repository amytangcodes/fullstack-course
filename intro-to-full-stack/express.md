###### [[Module Home](README.md)]

# Express

If we had to do all of the work of understanding an HTTP request and building a response ourselves, it would be a lot of work! Fortunately, there are libraries that can help make this easier for us, by reading the request that came in and providing a response. 

There are many libraries available for this purpose in Node, but we're going to focus on _Express_. Most Node applications are built using Express - it's simple to understand, but very powerful, and it simplifies the process of building a backend. 

Express is a minimal Node framework for building web applications. We're going to be using it to build an API.

### Exercise 1 - Simple Express App

We are going to set up our first Express application. Express can be installed via npm. The following command can be run to accomplish this:

```shell
npm install express --save
```

The following is how we can set up our first Express app to start listening for requests.

```javascript
'use strict';

// 1. Require express package
const express = require('express');

// 2. Instantiate express "app"
const app = express();

// 3. Start application
app.listen(3000, () => {
  console.log('app running...');
});
```

This is pretty complex, so let's break it down!

```js
const express = require('express');
```

First, we're requiring the Express library. We need to use `require` (as opposed to `import`) in Node applications, but they perform more or less the same function. This line by itself doesn't do anything, it just loads in the Express library so that we can use it later.

```js
const app = express();
```

We start using the Express library by just calling the function that we required previously. Think of `express()` as a way of saying, "I want to create a new empty application".

```js
app.listen(3000, () => {
  console.log('app running...');
});
```

This line tells Express to start our server, and specifies a port number to start listening on. This means we should be able to access our server by going to `http://localhost:3000`.

Once we have the initial setup done, we are able to create our first endpoint that will provide us with a response. We will start with a GET request to see this in action:

```javascript
'use strict';

// 1. Require express package
const express = require('express');

// 2. Instantiate express "app"
const app = express();

// 3. Add simple GET handler
app.get('/', (req, res) => {
  res.send('hello world');
});

// 4. Start application
app.listen(3000, () => {
  console.log('app running...');
});
```

Let's take a closer look at the GET handler that we've added...
```js
app.get('/', (req, res) => {
  res.send('hello world');
});
```
This is probably the most complicated, and most important line in Express. What we're doing here is telling Express how to respond to a particular type of request from the client.
- When we call the `get` method on `app`, we're telling Express that we want to respond to requests with a method of `GET`.
- The first argument is the _path_ we want to respond to. Think of it as everything that comes after your domain name in a URL. By entering `/`, we're saying that we want to respond to requests that are made without any additional information after the domain name.
- Finally, we have a function. Inside this function, we're going to specify what we should send back to the user. There are always at least 2 arguments passed to this function:
  - `req` is an object that contains information about the request. We'll look at this in more detail later.
  - `res` allows us to build a response to send back to the user.
  - There is also a third argument, `next`, that is used for error handling and some more advanced functionality that we will explore later.

### Exercise 2 - Utilizing the `res` object

The `res` object represents the HTTP response that Express sends when it gets an HTTP request. By convention, the object will be referred to as `res`, but the actual name is determined by whatever parameters are provided to the callback function. As an example, these will still work if `res` is replaced with `response`, but this is not following convention.

The `res` object contains a variety of methods that allow for response information to be sent in a variety of ways. 

```javascript
'use strict';

const express = require('express');
const app = express();

// 1. Send HTML
app.get('/html', (req, res) => {
  res.send('<h1>Hello World</h1><br /><h3>HTML Route<h3>');
});

// 2. Send JSON
app.get('/json', (req, res) => {
  res.json({ main: 'hello world', meta: 'JSON route' });
});

// 3. Send custom status code
app.get('/', (req, res) => {
  res.status(418).send({
    data: "I'm a Teapot"
  });
});

app.listen(3000, () => {
  console.log('app running...');
});
```

The following is a list of some of the useful methods that `res` has:

- `res.send`: Sends data back to the client. If you pass a string, it will be sent as HTML. If you send a JavaScript object, it will be sent as JSON.
- `res.status(code)`: Set the status of the response.
- `res.set(name, value)`: Set a header on the response.
- `res.redirect(path)`: Redirect the user to another URL.

### Exercise 3 - Utilise the `req` object

The `req` object is used to represent the HTTP request itself and contains properties for the query string, parameters that are being sent, headers, and other information pertaining to the request itself. Similar to the `res` object, `req` is the name of the object by convention, however, it is determined by the parameters that are passed to the callback function. The following examples would therefore still work if `req` were to be replaced with `request`.


```javascript
'use strict';

const express = require('express');
const app = express();

// 1. req.query
app.get('/query', (req, res) => {
  const { completed } = req.query;

  res.json({ data: req.query });
});
// This is an object containing a property for each query string parameter.

// 2. req.params
app.get('/params/:id', (req, res) => {
  const { id } = req.params;

  res.json({ data: req.params });
});
// This is an object containing properties that are mapping to named route parameters. Named route parameters are specified by the colon prior to their name in the route, as shown by ID in the above example.

// 3. req.method
app.get('/method', (req, res) => {
  res.json({ data: req.method });
});
// req.method will hold a string that corresponds to the HTTP method of the request (GET, POST, PUT, DELETE, etc).

// 4. req.path
app.get('/path', (req, res) => {
  res.json({ data: req.path });
});
// req.path will hold the specific path of the request URL. For this example, the path is /path.

app.listen(3000, () => {
  console.log('app running...');
});
```

`req` has a ton of extra functionality. Express will automatically parse the URL for you, and puts the information directly in the `req` variable for you.

Some useful properties of `req` are as follows:
- `req.query`: The parsed querystring of the request.
- `req.params`: Any named parameters associated with the requests.
- `req.method`: The method of the request.
- `req.path`: The path being requested.

### Exercise 4 - Express Router
```javascript
'use strict';

// 1. Require express package
const express = require('express');

// 2. Instantiate a router
const router = express.Router();

// 3. Instantiate expess "app"
const app = express();

// 4. Add route handlers
router.route('/')
  .get((req, res) => {

    // 4a. Respond with JSON data
    res.json({
      data: {
        path: req.path,
        method: req.method,
      }
    });
  })
  .post((req, res) => {
    // 4b. Response with JSON data
    res.json({
      data: {
        path: req.path,
        method: req.method,
        payload: req.body,
      }
    })
  });

// 5. Add router as middleware to "app"
app.use('/router', router);

app.listen(3000, () => {
  console.log('app running...');
});
```

The express.Router() class allows us to create modular, mountable route handlers. This allows us to group routes related to a particular section of our application. 

For example, we can group all of the functionality related to user accounts by appending `/users` to the end of our API URL, and adding our endpoint after this. We can have `/users/login`, `/users/signup`, `/users/forgotpass`, etc. 

With this, we know precisely what part of the application each route is referring to and this helps to remove a lot of ambiguity. In addition, we can have endpoints of the same name that relate to different sections of the application. For example, we might have a `/create` endpoint that can be used for creating a new user, and then another `/create` endpoint that creates a new item in our shopping cart. This would result in one API endpoint looking like `/users/create`, and then another as `/cart/create`.

### Exercise 5 - Serve HTML Files
```javascript
'use strict';

// 1. Require express package
const express = require('express');

// 2. Instantiate express "app"
const app = express();

// 3. Define some sane options
const options = {

};

// 4. Add static middleware
app.use(express.static('public', options));

app.listen(3000, () => {
  console.log('app running...');
});
```

When using the `.static` method, the root argument specifies the root directory from which to serve static assets. 

### Middleware

Middleware are functions that have access to the request object (req), response object (res), and the next function. Middleware functions can execute any code, make changes to request and response objects, end the request-response cycle, and call the next middleware in the stack.

<img alt="Image of middleware explanation from Express documentation" src="https://hychalknotes.s3.amazonaws.com/expressmiddleware--conEd_FullStack.png">

_The above image is from Express' official documentation: https://expressjs.com/en/guide/writing-middleware.html_


The above examples use middleware functions heavily, as each of the endpoints that we wrote has a middleware function included that contains the code to run when the specified endpoint is hit. These functions also have access to the request and response objects, and are therefore meeting the requirements for a middleware function.


