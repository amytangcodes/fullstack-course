###### [[Module Home](README.md)]

# Password Hashing

Well-built sites **hash** their passwords. As discussed in the top of Authentication, **Hashing** is basically encrypting a password in a way that can **never** be reversed. Password authentication works by transforming passwords using a hash, and storing that hash in the database in place of a password. When a user has to log in again, your system will run the hash function again, and check if the hash of the provided password matches the hash of the stored password.

Most authentication systems use an algorithm called **bcrypt** to hash passwords.

## Exercise - Password Hashing

We need to get our server running for the following password hashing example. Ensure that your folder structure is set up as follows for the following example:

```shell
.
├── api
│   └── routes
│       └── users
│           ├── userModel.js
│           └── userRoutes.js
│   └── server.js
```

### Create Resource - User

Let's start by setting up the model for a user in our system. We will keep our user simple with a user entry only having an email and password. 

We can use validation flags that Mongoose has built in in order to keep our data clean. This includes the `unique` and `required` flags. The `unique` flag ensures that no two documents will have the same value for the field that the flag is present on. For the following example, this validates that no two users will have the same email. The `required` flag ensures that a new entry can not be created if that field is not present.

```javascript
// api/routes/users/userModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
```

Recall that we can use the `exports` object to export our model and allow it to be used outside of the scope of the file that it's in.

Add the following below the schema, at the bottom of the file:

```javascript
// api/routes/users/userModel.js
exports.model = mongoose.model('User', userSchema);
```

Now that we have a model to work with, let's get started with setting up the routes we will need to test creating a user. For this example, we will have the endpoint of `/api/users/` lead to the creation of a new user. Recall that `router` is available to us from Express, and allows us to modularize our routes, with the added benefit of allowing us to group related routes together. 

Let's ensure that we've imported router at the top of our `userRoutes` file:

```javascript
// api/routes/users/userRoutes.js
const express = require('express');
const router = express.Router();
```

We also need to ensure that we bring in the User model that we previously created so that we are able to create the new users in our system.

We can import the model into our file by destructuring the `model` from the `exports` object. We also use the following syntax to give the model a clear name in the event that we are importing multiple models into our routes file:

```javascript
// api/routes/users/userRoutes.js
const { model: UserModel } = require('./userModel');
```

Now, let's skeleton the structure to accept a POST request to the `/api/users` endpoint:

```javascript
// api/routes/users/userRoutes.js
router
  .route('/')
  .post(async (req, res, next) => {
    try {

    } catch (e) {
      next(e);
    }
  });
```

Now, we want to access the `email` and `password` properties from the request object (`req`). We will destructure these values from the request body. Once we have these, we can use our model to create a new instance of our user.

```javascript
// api/routes/users/userRoutes.js
router
  .route('/')
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = new UserModel({ email, password });
    } catch (e) {
      next(e);
    }
  });
```

Now that we've created the user, let's save them to our database using the `.save` method. As the save happens asynchronously, we use the `await` keyword to ensure execution completes. We will also return the user in our response simply to validate what the entry will look like in our database. We are utilizing the status code of `201` to indicate a successful response: 

```javascript
// api/routes/users/userRoutes.js
router
  .route('/')
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = new UserModel({ email, password });
      const doc = await user.save();
      res.status(201).json({
        data: [doc],
      });
    } catch (e) {
      next(e);
    }
  });
```

Finally, let's ensure that we are exporting the `router` as we will ultimately need to bring this into our `server.js` file:

```javascript
// api/routes/users/userRoutes.js
router
  .route('/')
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = new UserModel({ email, password });
      const doc = await user.save();
      res.status(201).json({
        data: [doc],
      });
    } catch (e) {
      next(e);
    }
  });

exports.router = router;
```

Speaking of our `server.js` file, let's add the necessary code in here. First, we'll import all of our necessary packages at the top of the file, as well as our `router` from `express`:

```javascript
// /api/server.js
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const router = express();
```

Now let's import the user route that we wrote. We will use our destructuring syntax again to ensure that we are uniquely identifying these routes as user routes:

```javascript
// /api/server.js
const { router: userRoutes } = require('./users/userRoutes');
```

Recall that `body-parser` is the package that we use to ensure that we are able to handle JSON request bodies. We can add this package to our router by using the `.use` method.

```javascript
// /api/server.js
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
```

We also want to ensure that we are grouping related routes by adding the prefix to our endpoints. For our user routes, we want to add `api/users` before any endpoints we create. This can be done with the following:

```javascript
// /api/server.js
router.use('/api/users', userRoutes);
```

Now we will create our server using `http`. 

```javascript
// /api/server.js
const server = http.createServer(router);
```

Finally, we will be using mongoose to connect to our database and get our server running on our desired port.

```javascript
// /api/server.js
mongoose
	.connect('mongodb://localhost:27017/hashing', { useNewUrlParser: true })
	.then(async () => {
		console.log(`Connected to database at 'mongodb://localhost:27017/hashing'`);
		server.listen(3000, () => {
			console.log(`Server is running on PORT:3000`);
		});
	}) 
	.catch((err) => {
		console.error(err);
	});
```

Now we have a server running with our routes available to be accessed. Go into `Insomnia` and give the route a shot. Remember it can be accessed at `http://localhost:3000/api/users/`.

_Uh oh_, it looks like our password is being stored in plain text! We'll address this while we work on adding a login route.

### Create `/login` Route

Now that we've already set up the `/users/` route, we can use it as a reference as we create our `/login` route.

Let's return to our `userRoutes.js` to add the new `/login` endpoint. We will add the new route below our existing route:

```javascript
// api/routes/users/userRoutes.js
const express = require('express');
const router = express.Router();

const { model: UserModel } = require('./userModel');

// POST /api/users/
router
  .route('/')
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = new UserModel({ email, password });
      const doc = await user.save();
      res.status(201).json({
        data: [doc],
      });
    } catch (e) {
      next(e);
    }
  });

// POST /api/users/login/
router
  .route('/login')
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      
      } else {
        next(new Error('unauthorized'));
      }
    } catch (e) {
      next(e);
    }
  });

exports.router = router;
```

To start with the login process, we will use the `findOne` method available in Mongoose, and then compare the password that is passed with the request to the password that is on the user. The `findOne` method allows us to return a single document that matches the passed in search criteria. It will return the first document based on the natural order in which the documents are stored. To gain a deeper understanding on the `findOne` method, the documentation can be read [here](https://docs.mongodb.com/manual/reference/method/db.collection.findOne/). 

To start we will simply return the user if they match:

```javascript
// api/routes/users/userRoutes.js

// POST /api/users/login/
router
  .route('/login')
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (user && user.password === password) {
        res.json({
          data: [user],
        });
      } else {
        next(new Error('unauthorized'));
      }
    } catch (e) {
      next(e);
    }
  });
```

Great! Now we are returning the user if we find them, and in the event that the password matches. Now we are finally set up to introduce the concept of password hashing so that we do not do a plain text string comparison of the password.

#### Add Password Hashing

We will install a package called `bcryptjs`. This library implements the widely used `bcrypt` password hashing function. This handles all of the mathematical complexities of password hashing for us, and returns the encrypted password. We can install this library as follows:

```shell
npm install bcryptjs
```

Let's now return to our userModel to add a `pre` middleware hook to the `.save()` method in order to hash the user's password **before** saving them in the database. The `pre` hook allows you to specify the function that you would like to run the code before. You can read more about `pre` middleware [here](https://mongoosejs.com/docs/middleware.html#pre) 

Let's return to our `userModel.js` file and skeleton out our `pre` save hook function. 

```javascript
// api/routes/users/userModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = exports.schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

userSchema.pre('save', async function(next) {
  
});

```

The `this` keyword in the context of the `pre` hook callback function refers to the user object. We will create a variable called `user` and assign it to `this` so that we are always aware of what is being referred to.

An important note here is that we only need to hash the password if the user is being newly created or if the user is changing their password. We _do not_ need to provide a new hash every time a user logs in. 

Mongoose has a built in prototype function and property on the model that can be called to assist us in completing these checks. 

The function that we are interested in is the `isModified` function and the property is the `isNew` property. These check if the document has been changed (in the event that the user is changing their password), or if it is a new document (a new user is being created).

We can do this check within our `pre` save hook callback function as follows:

```javascript
// api/routes/users/userModel.js
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password') || user.isNew) {
    try {
      
    } catch (e) {
      return next(e);
    }
  } else {
    return next();
  }
});
```

Perfect, now we know we are hashing the password, and it is being done only when required. We can now use the `bcrypt` library which has a `hash` function built in. This function takes in a password, as well as a value for the number of times to salt the password. Once we have generated a hash of our password, we can simply assign it to the `user.password` property. 

```javascript
// api/routes/users/userModel.js
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password') || user.isNew) {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
      return next();
    } catch (e) {
      return next(e);
    }
  } else {
    return next();
  }
});
```

And just like that our password is being encrypted and being stored in our database in its encrypted format. 

We're almost done! We can store our password in the proper way now, but, we can't properly check if the password the user types when logging in (the one sent with the request body) matches the encrypted password that we've stored in the database. 

To do this `bcrypt` has a handy function available called `compare` that takes in two passwords to compare (one in plain text and the other in encrypted format) and returns a Boolean indicating if they match.

We will write a custom method on our model so that we can access this functionality within our route. Below the `pre` save hook that we just wrote in our `userModel.js` file, add the following:

```javascript
// api/routes/users/userModel.js
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
```

Amazing! Now we can use the `comparePassword` method within our `/login` route to properly compare our password.

Let's return to our `userRoutes.js` file to add the password comparison.

In the event that we find our user in our database lookup, we will only deem the user to be a full match if the password that is passed in matches the password that we have stored in our database. This will look as follows:

```javascript
// api/routes/users/userRoutes.js
router
  .route('/login')
  .post(async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
          next(new Error('not found'));
      } else {
        const match = await user.comparePassword(password);

        if (match) {
          res.json({
            data: [user],
          });
        } else {
          next(new Error('unauthorized'));
        }
      }
    } catch (e) {
      next(e);
    }
  });
```

We've done it! We have added functionality to hash our password to ensure that we aren't storing it in plain text! We've also created the functionality to properly check if the passed in password at login matches the encrypted password that we have stored in the database.
