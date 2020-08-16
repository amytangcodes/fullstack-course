###### [[Module Home](README.md)]

# Mongoose

## Why Do We Need This Tool?
Mongoose acts as the interface between our express app and the database; your **Database Access Layer (DAL)**. Out of the box, MongoDB doesn't enforce any structure on your documents and it doesn't give us tools to relate documents to each other.

## What Is A Model?
In simpler terms, a model is an **Entity**. A model is the interface we use to interact with each collection. You can think of it as the _class definition_ in object oriented programming, or a _recipe_ in terms of baking. It doubles as the description of the **entity** as well as the access point for the collection.

```javascript
const Model = require('./ModelFile');

// Create a new instance (document/row)
const instance = new Model();

// Read instances (documents/rows)
Model.findById()

// Use an instance to interact with a "document/row" level
instance.update();

// Use `Model` to interact with the "collection/table" level
Model.find();
// SQL Equivalent: SELECT * FROM Model;

Model.count();
// SQL Equivalent: SELECT count(*) FROM Model;

Model.deleteMany();
// SQL Equivalent: DELETE FROM Model;
```

## Connecting To A Database

We must install the `mongoose` package in order to make use of it. This can be done by using `npm`:

```shell
npm install mongoose
```

Mongoose can then be imported into a project using the following line:

```js
const mongoose = require('mongoose');
```

Mongoose has a method `connect` that is used to connect to a single database. The connect method takes a `mongodb based URI`, the parameters of `host`, `database` (optional), `port` (optional), and `options` (optional).

A breakdown of the `mongodb based URI` can be found [here](https://docs.mongodb.com/manual/reference/connection-string/). 

The following is an example code snippet where Mongoose is being used to connect to a local database at the provided `mongodb` URI.

```javascript
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/hogwarts';

mongoose
  .connect(uri)
  .then(() => {
    console.log(`Successfully connected to: ${uri}`);
  })
  .catch(err => console.log(err.message));
```

The `mongodb` portion of the URI is the required prefix that identifies to Mongoose that the string is in the connection format. `localhost:27017` refers to the host and port, and these are the default values for these parameters. Finally, `/hogwarts` in this example is referring to the name of the database.

## Schema

A schema maps to a collection in the database, and defines the structure of the collection. 

This can include specifying data types, default values, if the fields are required, and more for the properties within the document.

For more information around Schemas in Mongoose, the documentation is excellent, extensive, and can be found [here](https://mongoosejs.com/docs/guide.html)

The following code is an example of a schema for a blog post:

```javascript
'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
  /* 
    Here we are specifying that the author
    and body parameters are String type.
  */
  author: String,
  body:   String,
  /* 
    The following specifies that the collection will have an array containing objects that represent comments that would be written on a blog post.  
  */
  comments: [
    {
      body: String,
      date: Date,
    }
  ],
  /*
    Properties can also utilize objects to add multiple specifications. In this example, the date property is being specified to have the date type. The default value specifies that the default blog post date should be the current date and time.
  */
  date: {
    type: Date,
    default: Date.now
  },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});

```

#### Connecting Schema To Collection

As the model is representing the Data Access Layer, the connection must still be made to ensure that the schema is being linked to the corresponding collection in the database.

This can be done by using the `.model` method on the mongoose object. This method takes in a model name and schema and returns an instance of the schema.

```javascript
const Blog = mongoose.model('Blog', blogSchema);
```

We can then use the `Blog` variable to create new instances of the blog schema throughout our code.

#### Model Instances
```javascript
'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema
const animalSchema = new Schema({ name: String, kind: String });

// Connect schema to collection
const Animal = mongoose.model('Animal', animalSchema);

// Create an instance of animalSchema
const dogRex = new Animal({ name: 'rex', kind: 'dog' });
```

An instance of the schema - `dogRex` shown above is a document. Documents have their own built in instance methods as well, and those can be explored [here](https://mongoosejs.com/docs/api/document.html).

## Task 1
Use mongoose to create a new schema and add some documents.

#### Instance Level Helper Methods

We are able to write our own instance methods for schemas that we have created. This allows us to write useful functions for complex interactions with our database.

For example, we can write a function that will return genres matching a specific regex that we provide. We use the `.method` method (talk about confusing naming!). This method takes in a name of a method so we have a way to call it later, as well as a function to execute when the method is called. 

The following is an example of creating a method called `findMatchingGenre` which will return movies matching the specific genre provided to the regex argument.

```javascript
'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: String,
  genre: String,
  // ...
})

// No arrow functions allowed because we want access to `this`
movieSchema.method('findMatchingGenre', function () {
  return this.model('Movies').find({ genre: { $regex: this.genre } });
});
```

Now, following the creation of an instance of the model such as:

```js
const Movie = mongoose.model('Movie', movieSchema);

const favouriteMovie = new Movie(title: 'The Matrix', genre: 'Action');
```

We are able to access the custom method on the created instance by simply calling it:

```js
favouriteMovie.findMatchingGenre()
```

#### Nested Schemas

In addition, it is possible to nest schemas within other schemas. Nested schemas can also be referred to as subdocuments (remember that the contents of our collections are called documents). Nested schemas are not saved individually, and are only saved when their parent document is saved. 

Nested documents are a useful way of connecting different database entries that can be meaningfully linked.

For example, we want to connect a user to the blog post that we are writing. We will have a user schema that specifies different characteristics about the user such as their first and last name. We will have a separate schema for the post itself. In order to create the connection, we specify the type of the user parameter in the post schema as a schema object, with a reference to the name of the user schema, i.e. `User`. 

The `ref` keyword is how Mongoose knows which model to use during population. When going to save the model, the model that is nested and linked with the `ref` keyword can be connected by using the `_id` of the model.

The following shows how we make this connection in Node:

```javascript
// user.js
'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = exports.schema = new Schema({
  firstName: String,
  lastName: String,
});

exports.model = mongoose.model('User', userSchema);
```

```javascript
// post.js
'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const { schema: userSchema } = require('./user');

const postSchema = exports.schema = new Schema({
  title: String,
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  user: {
    /* 
      This is a unique type available on the 
      schema object
    */
    type: Schema.Types.ObjectId,
    /*
      This will allow you to reference the schema
      that you are interested in making the association to.
    */
    ref: 'User',
  }
});

exports.model = mongoose.model('Posts', postSchema);
```

The following is an example of using the `User` schema in another schema, showing that there is no restriction to the nesting, and the same schema can be nested within multiple other schemas.

```javascript
// comment.js
'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = exports.schema = new Schema({
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

exports.model = mongoose.model('Comments', commentSchema);
```
