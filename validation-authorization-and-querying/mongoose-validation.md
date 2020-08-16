###### [[Module Home](README.md)]

# Validation in Mongoose

If you take a look at the work we've done so far in the class, you might notice one problem - our programs will accept whatever data we send them. This works fine when we're developing things ourselves, but when other users start using your application, it can start to be a problem.

Whenever you're accepting information from a user (or anything else other than your own code), you should consider what sorts of **validation** you want to add to your application. Validating data just means that you're determining whether a particular piece of information makes sense. Validation can be there as a convenience to the user, to stop them from making obvious mistakes (like entering birth date in the future), or it can sometimes have serious implications (like preventing an application running a store from having orders with negative value, or ensuring a password is appropriate).

We're going to look at validation from two sides - how we can get our **back end** to reject invalid data, and how to relay that information to our users on the front end.

## Validating our mad libs application.

Take a look at the mad libs application located in your exercises:

This application is an example of something that takes in a good amount of data, with different rules for each piece
of information that comes in, for instance:

- "A number between 1 and 10" should look like a number,
  and be between those values.
- "Plural nouns" should end with an S.
- "Adverbs" should end with 'ly'.
- "Verbs ending with "ing" should end in ing.

Our job is going to be to implement validation for this application.

## Validation: Where to start

The most important thing to remember about validation is to **always start with the back end**. Remember that your React application communicates with the backend through AJAX requests. The thing is, those requests can be tampered with or completely fabricated, so any validation you do in React is not guaranteed to work if you assume someone is acting maliciously (since they could make up their own AJAX requests with invalid data, bypassing React validation). In the case of a mad libs generator, this is a pretty small risk, but it's still worth watching out for.

## Valiation in mongoose

Let's take a look at our model:

```javascript
const WordsSchema = new mongoose.Schema({
  number_1: Number,
  foreign_country: String,
  adverb: String,
  ing_verb_1: String,
  body_part_1: String,
  plural_noun_1: String,
  building: String,
  adjective: String,
  body_part_2: String,
  body_part_2: String,
  plural_noun_3: String,
  ing_verb_2: String,
  number_2: Number,
  plural_noun_4: String,
  verb: String,
  plural_noun_3: String,
  language: String,
  noun: String
});
```

We're already doing a little bit of validation here, by checking that `number` is actually a number. There's a bit more we want to do though - fortunately Mongoose simplifies this for us.

To add validation to a model, we need to define the schema in a slightly different way:

```javascript
const WordsSchema = new mongoose.Schema({
  number_1: {
    type: Number,
    required: true
  },
  foreign_country: String,
  adverb: String,
  ing_verb_1: String,
  body_part_1: String,
  plural_noun_1: String,
  building: String,
  adjective: String,
  body_part_2: String,
  body_part_2: String,
  plural_noun_3: String,
  ing_verb_2: String,
  number_2: Number,
  plural_noun_4: String,
  verb: String,
  plural_noun_3: String,
  language: String,
  noun: String
});
```
Take a look at `number_1`. Instead of passing just a type to Mongoose, we pass a Javascript object with `options` for the specified field. You should always include a `type` option (which will include the type that previously would have been the whole value), along with any validations that you want to put on the field.

The following validations are built into Mongoose:

- `required` - Validates that this field was provided
- `min` - Ensures a `Number` is greater than or equal to this number.
- `max` - Ensures a `Number` is less than or equal to this number.
- `minlength` - Ensures a `String` is at least this many characters.
- `maxlength` - Ensures a `String` is at most this many characters.
- `match` - Apply a regular expression to a string.
- `enum` - Ensure a `String` is in the list of provided values.

If you try saving a blank `number_1` now through React, you'll notice that saving no longer works. We'll get back to improving the user experience soon, but for now we know that number_1 will always be provided.

## Exercise: Implement the rest of the validations

Implement these validations:

- Ensure that all fields are required
- Ensure that `number_1` is between 1 and 10.
- Ensure that `number_2` is a number between 1 and 200
- Ensure that `foreign_country` is in a list of places (like USA, China, or England - or whatever!).

## Dealing with validation errors

When you have validations defined on a model, any attempt to `save` an invalid
model will result in an error (that you can catch with promises).

```javascript
var product = new Product({title: ''});
product.save().then(function() {
  console.log("this won't be executed since the model was invalid");
}).catch(function(err) {
  console.log("error saving the product", err);
})
```

The `err` object passed when validation errors occur contains useful information on what the errors were. Here's a sample error object:

```json
{  
   "message":"Post validation failed",
   "name":"ValidationError",
   "errors":{  
      "title":{  
         "message":"Path `title` is required.",
         "name":"ValidatorError",
         "properties":{  
            "type":"required",
            "message":"Path `{PATH}` is required.",
            "path":"title",
            "value":""
         },
         "kind":"required",
         "path":"title",
         "value":""
      }
   }
}
```

The key information is stored in `errors`, which is keyed by the field where the error occurred. You can use this to generate appropriate error messages for your users.

### Using validation in a controller

We can use validation in a controller by taking advantage of the promise returned,
and modifying the response we're sending to the client based on whether we were
able to successfully save the model:

```javascript
exports.update = function(req, res) {
  Product.findById(req.params.id)
  .then((product) => {
    product.title = req.body.title;
    product.save()
    .then(() => res.send(product))
    .catch((err) => {
      res.status(422);
      res.send(err);
    })
  })
  .catch((err) => {
    res.status(404);
    res.send("Product not found");
  })
}
```

## Exercise: Add error handling to your application

Modify your controller actions so that errors are returned to the client with
a status code of 422. Try seeing if you can detect and deal with these errors in React as well.

## More complex validation - regular expressions

There's a few validations we were planning to do that we haven't implemented yet - things
like ensuring that plural nouns end with 's', adverbs end with 'ly', and verbs ending with 'ing' end with, well, 'ing'.

The basic mongoose validations won't help us here - we'll need to use something called 
*regular expressions*. Regular expressions let you compare a piece of text to a *pattern*,
and can tell you whether that piece of text matches that pattern. They're handy when you want to validate the format of a string for things like e-mails, web addresses, etc.

Regular expressions are a big topic, but at a high level, they're like superpowered wildcards. You use a regular expression by specifying the patterns you want to match, along
with "special characters", that match strings in various ways. For example:

- `.` matches any single character
- `+` means that the previous character should appear one or more times
- `*` means that the previous character should appear zero or more times
- `?` means that the previous character may or may not be there
- `^` matches the beginning of a string
- `$` matches the end of a string

Some examples of regular expresssions:

- `^.*s$` - A word that ends with an 's' (anything, followed by s)
- `^.+@.+$` - An e-mail address (anything, followed by @, followed by anything)
- `https?:\/\/.*` - A URL

https://www.regexpal.com/ is a great tool to test out regular expressions (there's tons
of other ones as well). You can find a great regular expression 'cheatsheet' here - 
https://www.debuggex.com/cheatsheet/regex/javascript

To use the `match` validator in mongoose, just pass a regular expression to Mongoose, like
this:

```javascript
plural_noun_1: {
  type: String,
  format: /^.*s$/
}
```

Your fields will now be validated against that regular expression!

Try adding validations for ing verbs, and adverbs.