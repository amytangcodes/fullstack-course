###### [[Module Home](README.md)]

# Querying in Mongoose

We've learned how to list everything in a model. Often though, you need additional flexibility beyond just listing everything, especially when multiple models are involved. Let's go over how to query our models to return only a subset of data, or in order to sort how our data is returned.

## MongoDB Queries
Querying in MongoDB isn't as challenging as you might initially expect. We can pass an object to `find` that outlines properties that we want to match on documents in the system:

```javascript
// List all posts with a title of 'My Post'
Post.find({ title: 'My Post' });

// List all users with a gender of 'F', and an age of 25
User.find({ gender: 'F', age: 25 });
```

You can include as many properties as you want when querying this information. MongoDB will return any models that match *all* of the criteria that you specified. Note that matches need to be exact as well - if there's any differences, no result will be returned.

## Finding using $or
If you want to find models that match one of a list of criteria, you can use $or in your query:
```javascript
// List all products that are either featured or on sale:
Product.find({ $or: [
    { featured: true },
    { sale: true },
]});
```

When you use `$or`, give it an array of queries. If any of the queries match, you'll get that document back. You can use this to do even more complicated queries:
```javascript
// List all products that are either featured with a category of 'Books', or on sale
Product.find({ $or: [
    { featured: true, category: 'Books' },
    { sale: true },    
]})
```

## Greater than less than
You can use `$gt`, `$gte`, `$lt`, and `$lte` to match records that are greater or less than specific values:
```javascript
// Find all users that are older than 18.
User.find({ age: { $gt: 18 }});

// Find all products that cost between 10 and 50 dollars:
Product.find({ price: { $gte: 10, $lte: 50 } });
```

## Querying Nested Properties
If you have nested properties, you can query them using `.` to access properties on the child document:
```javascript
// Find all people in Toronto
Person.find({ 'address.city': 'Toronto' });
```

Note that you have to wrap the entire field in a string (JavaScript requires this because the `.` is a special character)

## Matching Substrings
You can use the `$regex` keyword to search against sub-strings of a string field. With `$regex` you are actually providing a regular expression, but passing a substring to this does what you would expect it to:

```javascript
// Find all products matching 'Lord of the Rings'
Post.find({ title: { $regex: 'Lord of the Rings' }});
```

One other thing to keep in mind with regex is that by default they are **case sensitive**. To make them case insensitive, you can supply **options** to the regex match. An option of 'i' means case insensitive.

```javascript
// Find all products matching 'Lord of the Rings' - regardless of case
Post.find({ title: { $regex: 'Lord of the Rings', $options: 'i' }});
```

For more MongoDB query operators, take a look at the docs available [here](https://docs.mongodb.com/v3.2/reference/operator/query/).

## Sorting Data in Mongoose
It's also useful to sort data that's returned from a query. You can do this using the `sort()` function in Mongoose. This can be called on the result of the `find()` function, but you need to call `exec()` after it's called. When using `find()` to execute our query, a promise is returned that can be called with the `exec()` function. More information about the `exec()` function is available [here](https://mongoosejs.com/docs/queries.html#executing).

`sort` takes a JavaScript object where the keys are the fields you want to sort by, and the values are either 1 (for ascending order) or -1 (for descending):

```javascript
// Sort posts by title:
Post.find().sort({ title:1 });

// Sort products by whether they're featured, and then by price (descending)
Product.find().sort({featured: 1, price: -1});
```

Note that large datasets will result in a slow query time when attempting to sort results.