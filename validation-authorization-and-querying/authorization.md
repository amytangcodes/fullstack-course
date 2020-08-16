###### [[Module Home](README.md)]

# Authorization

We've learned how to implement **authentication** in our application, but there's more to security than letting users log into our system. For most applications, you need to restrict what your users can do in your application. To do that, we need to implement **authorization**.

## Authentication vs. Authorization

**Authentication** means being able to identify who a user of your system is in a secure way, and is usually associated with logging into a system. **Authorization** deals with what that user is allowed to do once they've logged in. The two work hand in hand, and making a secure application requires that you think about both of them.

Unlike authentication, authorization is a little more free-form and less "standardized". Most systems will let you log in in a fairly standard way (either with a username / password, or OAuthing to a separate site), but authorization will be tightly tied to the type of application you're making. Here's some examples of authorization on the web:

- You can't make new posts to a Wordpress site unless you have an admin account.
- You can't modify other people's orders on Amazon.
- Facebook allows you to specify which users can see one of your posts.

Depending on the type of authorization you need to implement, different approaches can be taken.

## "Global" Authorization

The simplest type of authorization is **global authorization** - restricting users from accessing a part of your app, or performing certain functions unless they have a particular role.

Let's try adding an "author" role to our Notebook application that allows people to add new notes to the system.

First, let's add a new property to our User model to store a role:

```javascript
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: {
      type: String,
      enum: ['viewer', 'editor'],
      default: 'viewer'
    }
});
```

`role` isn't anything special - it's just a standard string property, and you can set up authorization however you'd like in your application.

The next thing we need to do is restrict users from adding posts when they don't have a role of `editor`. We could do this in React directly, but like validation, we always want to implement our changes on the server first, so that malicious users can't work around our front end and get past our security roles.

One way to do this is to add some code directly in our controller:

```javascript
app.post('/api/note', (req, res) => {
  if (req.user.role !== 'author') {
    res.status(401).send("You need to be an author to create notes");
  } else {
    const note = new Note(req.body);
    note
      .save()
      .then((doc) => res.status(200).send(doc))
      .catch((err) => {
        console.log(err);
      });
  }
});
```

This works, but it makes our create action a little heavy and hard to follow, and we might want to do this type of authorization in other spots. Instead, let's try using **middleware** to restrict actions to a particular user.

Remember, middleware works exactly the same as a "normal" controller method, except that we can call `next` to forward requests on to the next item "in the chain". Let's make a new piece of middleware named `requireEditor`

```javascript
const requireEditor = (req, res, next) => {
  if (req.user.role !== 'editor') {
    res.status(401).send("Must be an editor to create posts");
  } else {
    next();
  }
}
```

Once we have that, we can "lock down" creating posts by adding it to the middleware "chain":

```javascript
app.post('/api/note', requireLogin, requireEditor, (req, res) => {
```

You can read these strings of middleware as going from left to right - i.e.:

- Check that the user is making a POST request to `/api/note`
- Check that they're logged into the system (we're assuming for this example that this middleware function has already been written for our application).
- Check that they have the editor role.
- Finally, let them add a note.

Give it a try - you should notice that you're no longer allowed to create a note in React.

### Implementing the front-end

Just like with validation, implementing authorization on only the backend leaves us with a not great user experience. Fortunately, it's pretty easy to guard against this in React. We're already pulling our user object as part of the login, so let's use that to determine if the user can create posts. Modify `ShowNotes.js` to add the following check.

```javascript
{ this.props.user.role === 'editor' ?
    <CreateNote user={this.props.user} onCreate={ this.refresh } /> :
    null
}
```

### Making things even more generic

If you have more than one role you're working against, you can make your middleware even more flexible by adding middleware that can take a parameter:

```javascript
const requireRole = (requiredRole) =>
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      res.status(401).send("You don't have the correct role");
    } else {
      next();
    }
  }
}
```

This is a common pattern in middleware, but it's a little complicated, so let's walk through it.

Remember that middleware always needs to come in the form of a **callback function** that accepts `(req, res, next)`. What we're doing here is creating a "wrapper" function that itself returns a middleware function. By doing that, we can make the required role dynamic, and use it like this:

```javascript
app.post('/api/note', requireLogin, requireRole('editor'), (req, res) => {
```

### Locking down an entire section of your application

If you have lots of routes that are using your middleware, you can use middleware to restrict usage to an entire subset of your app:

```javascript
app.use('/api/note/*', requireRole('editor'))
```

## Entity-based authorization

In addition to global authorization, where an entire action is guarded by some requirement, authorization often needs to work with individual models. For example, in our notebook application, we may want to prevent users from deleting notes that aren't theirs.

Just like with global authorization, we can block this in the controller:

```javascript
app.delete('/api/notes/:id', requireLogin, (req, res) => {
  Note.findById(req.params.id)
  .then(note => {
    if (!note.author.equals(req.user._id)) {
      res.status(401).send("You can't delete someone else's notes!")
    } else {
      return note.deleteMany().then(() => res.send('OK'));
    }
  });
})
```

What we're doing here is finding the note first, and checking whether the author of the note matches the currently logged in user (One important note - because `_id` is an object rather than a string, we need to call `equals` to compare _ids because otherwise Javascript will compare by reference).

Similarly, we can block things on the frontend in React. We'll need to pass the user down to our Note component, and modify Note to accept those params in it's arguments:

```javascript
// ShowNotes.js
 {this.state.notes.map(note => <Note key={ note._id }
                                    onDelete={ this.refresh }
                                    user={ this.props.user }
                                    {...note} />)}

// Note.js
const Note = ({_id, title, description, author, onDelete, user}) => {
```

Once we've done that, hiding the delete button is as simple as comparing the author to the user:

```javascript
{ author == user._id ?
  <a href='#' onClick={ deleteNote }>(Delete)</a> :
  null
}
```

### Improving back-end authorization - using middleware

Just like with global authorization, we can make our code cleaner and less repetitive by using middleware. Unlike global authentication though, we have a bit of a challenge here - in order to check permissions, we need to have already loaded the note from the database.

Fortunately, we can use middleware for this too! Let's add a new piece of middleware that loads a note and stores it on `req.note`:

```javascript
const loadNote = (req, res, next) => {
  Note.findById(req.params.id)
  .then(note => {
    req.note = note;
    next();
  })
  .catch(err => res.status(404).send("Note not found"))
}
```

This middlware is handy to use whenever we need to load a note as part of an action - we can add it to the chain and not have to worry about finding logic in our controller. Another nice advantage is it takes care of handling 404s for us:

```javascript
app.delete('/api/notes/:id', requireLogin, loadNote, (req, res) => {
  if (!req.note.author.equals(req.user._id)) {
    res.status(401).send("You can't delete someone else's notes!")
  } else {
    return req.note.deleteMany().then(() => res.send('OK'));
  }
})
```

Now that we have that piece of middleware, we can add another one to ensure that users can only do things with their own notes:

```javascript
const myNotesOnly = (req, res, next) {
  if (!req.note.author.equals(req.user._id)) {
    res.status(401).send("You can't do this with someone else's notes!")
  } else {
    next();
  }
}
```

Finally, we can simplify our delete action to just do the following:

```javascript
app.delete('/api/notes/:id', requireLogin, loadNote, myNotesOnly, (req, res) => {
  return req.note.deleteMany().then(() => res.send('OK'));
})
```

Middleware can be very powerful for making your controller actions concise and focused only on the thing that you want to accomplish.