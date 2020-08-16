###### [[Module Home](README.md)]

# Database Design

In order to design a database, you need to understand its purpose - this will be related to the product that you are trying to build, for example:

```shell
IMDB is a database of information related to films, television shows, and actors.
```

Once you have written out the purpose of your database, identify the nouns - these will be your **entities**:

* Films
* TV Shows
* Actors

Once you have determined your entities, start to think about the properties or traits of that entity. These will be your attributes:

```markdown
+--------------------+
|       Film         |
+--------------------+
| Title              |
| Release Year       |
| Genre              |
| Director           |
| Actors             |
+--------------------+
```

```markdown
+--------------------+
|      TV Show       |
+--------------------+
| Title              |
| Release Year       |
| Genre              |
| Director           |
| Seasons            |
| Actors             |
+--------------------+
```

```markdown
+--------------------+
|       Actor        |
+--------------------+
| Name               |
| DOB                |
| Credits            |
| Movies             |
| TV Shows           |
+--------------------+
```

## Exercise
Break down some of the entities and attributes for:
- Amazon
- Twitter
- Medium
- Netflix
- GitHub
- Gmail


## Relationships between entities
Once you start building out your documents and collections, you'll see the places in which they relate to one another. Movies and TV Shows both feature actors, for example. Actors can appear in both TV Shows and Films.

Understanding how documents relate to other documents (and collections) is an important part of designing your database.

Let's talk about the main kinds of relationships you'll find when designing your database.

When drawing out a database design, we often use symbols as a shorthand to specify the relations between entities. The following are examples of some of the symbols that are available to us when specifying these connections.

<img src="https://d2slcw3kip6qmk.cloudfront.net/marketing/pages/chart/erd-symbols/ERD-Notation.PNG">

## One-to-one relationship

One document is associated with one and only one other document.

Some examples:

* An application has one resume, and a resume only ever relates to one applicant.
* A wizard has only one wand, and that wand belongs only to one wizard.
* A city has only one capital, and a capital only ever has one city.

In MongoDB, we can represent one-to-one relationships in two ways:

### Linking

```javascript
// wizard
{
  _id: 1,
  name: 'Dumbledore',
  wand: 20
}

// wand
{
  _id: 20,
  lengthInInches: 15,
  core: 'Thestral Tail Hair',
  type: 'Elder',
  // we could also link to the wizard from the wand, like below:
  // IDs are used for this linking as they are intended to be unique.
  wizard: 1
}
```

### Or embedding

```javascript
{
  _id: 1,
  name: 'Dumbledore',
  wand: {
    core: 'Thestrial Tail Hair',
    type: 'Elder',
    lengthInInches: 15
  }
}
```

### Which one should I use?

* _Frequency of access_: If you're going to grab the wizard a lot, but not need their wand that often, you might keep them separate.
* _Size of items_: If you're going to keep updating one of the wizard (or the wand), but not the other, you might want to keep them separate so you don't have to keep needlessly updating one of them if it isn't going to change much.
* _Size_: If your wand is so large (16mb is the limit in MongoDB), you might not be able to embed it.

## One-to-many relationship

A one to many relationship is where one entity maps to many entities. Some examples:

* City (one) - People (many)
* Hogwarts House (one) - Students (many)
* Customer (one) - Orders (many)
* Blog post (one) - Comments (many)
* Shopping Cart (one) - Products (many)

In MongoDB, we could represent one-to-many relationships like this:

```javascript
// city
{
  name: 'Toronto',
  population: 2809000,
  people: [
    "Bob",
    "Doug",
    "Sue",
    "Archibald",
    "My cat skittles"
    //... etc, 2088995 more times.
  ]
}
```

But our people array would become so huge it would make our document way too big. But what if we flipped it the other way?

```javascript
// people
{
  name: 'Archibald',
  city: {
    name: 'Toronto',
    population: 2809000
  }
}
```

Now every single person has a breakdown of all the information pertaining to the city they're in, which causes needless repetition.

The solution? Linking.

```javascript
// people collection
{
  name: 'Skittles',
  city: 'Toronto'
}

// city collection
{
  _id: 'Toronto',
  population: 2809000
}
```

The many (people) links to the one (city) through the city/\_id link.

## One-to-few

What if we had a much smaller relationship though, like one blog post to some comments? Something like this:

```javascript
{
  blogPost: `Why eating potato latkes is delicious`,
  author: `Zayne`,
  comments: [
    {
      comment: `Agree!`,
      author: `My grandmother`
    },
    {
      comment: `Dont forget the applesauce!`,
      author: `Someone else's grandmother`
    }
  ]
}
```

Here we can take advantage of _embedding_ instead of nesting. By embedding, we gain a couple of benefits:

* We grab the whole document and everything related to displaying it with a single query.
* Because we store our comments in an array we're able to preserve their order. If we didn't do this we'd have to keep an order property on each comment document.

## Many-to-many relationship

Many of an entity can be associated with many of another entity.

Some examples:

* Books to authors. A book can have many authors, and an author can write many books.

```javascript
// book
{
  id: 1,
  title: "Gone with the Wind",
  authors: [22, 13]
}
{
  id: 22,
  author: "Caspar Wei",
  books: [1, 33, 45]
}
```

* It's better to link these in one document instead of both to decrease the possibility of inconsistency.
* You could also embed the book directly in the author document, but the book could end up being duplicated if it belongs to two authors.