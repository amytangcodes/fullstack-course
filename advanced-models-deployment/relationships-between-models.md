# Relationships between models in Mongoose

Most applications that you build will have more than one model - or at the
very least, more complicated structures than just simple properties on the same
model. MongoDB doesn't formally support relationships between models, but
it's possible to build this in code, and Mongoose adds a lot of functionality
to make this easier for you.

## Relationships in Mongoose

Mongoose has two different ways to model relationships between data:

### Nesting

The simplest way to relate data together is to **nest** the data inside a parent
model. You can do this by defining an additional schema, and creating a field
on the parent model that has a type of the schema you defined:

```javascript
var AddressSchema = new mongoose.Schema({
  address: String,
  city: String,
  state: String
});

var ContactSchema = new mongoose.Schema({
  name: String,
  address: AddressSchema
});
```

You can associate multiple pieces of data when nesting by making your field
an array:

```javascript
var ProductSchema = new mongoose.Schema({
  name: String,
  price: Number
});

var OrderSchema = new mongoose.Schema({
  user: String,
  products: [ProductSchema]
});
```

Nesting is straightforward to set up, but it does have some limitations:

- If the object you are nesting can be associated with multiple things, data
  may be duplicated. For example, in the product example above, the price of
  each product would be duplicated in every order in the system. If you needed
  to update that information, it would be hard to do so.
- There's no way to represent data that isn't associated with a model. For
  example, in the order example above, products should be able to be stored
  in the database even if they don't have associated orders.
- If your documents get very large due to nesting you can run into performance
  problems (and there's an absolute upper limit of 16 MB)

## Associating

The other way to model relationships in Mongoose is to associate two separate
models together. To do this, you create a new property on one of the models
that stores the `_id` field of the other model:

```javascript

// api/addresses/model.js
var AddressSchema = new mongoose.Schema({
  address: String,
  city: String,
  state: String
});

module.exports = new mongoose.Model('Address', AddressSchema);

// api/people/model.js
var PersonSchema = new mongoose.Schema({
  name: String,
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }
});

module.exports = new mongoose.Model('Person', PersonSchema)
```

You can also relate to multiple models, by creating an array of ObjectIds:

```javascript
// api/products/model.js
var ProductSchema = new mongoose.Schema({
  name: String,
  price: Number
});

module.exports = new mongoose.Model('Product', ProductSchema);


//api/orders/model.js
var OrderSchema = new mongoose.Schema({
  user: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  ]}
});

module.exports = new mongoose.Model('Order', OrderSchema);
```

Associating rather than nesting adds flexibility, but does make things more
complicated to model:

- Whenever you retrieve a list of models with an ObjectId reference (with `find`), you
  won't get the actual related models, but just their ids. You need to make
  additional calls to MongoDB to return the records in question, which can slow
  down your application.
- Updating both a 'parent' and 'child' model at the same time is more complicated.

As with nesting, defaulting arrays of objects is usually a smart idea.

### Which should I choose?

Use **nesting** when the two models are tightly linked. When the following things
are true, nesting makes sense:

- Your UI doesn't need to deal with the 'child' model independently of the parent.
  For example, you would need to show a product page independently of an order,
  but you wouldn't need to show someone's address independently of that user.
- You need to list all of a sub-model somewhere in your app. For example, if you
  needed to list all addresses independently of the users who 'own' that address,
  you might want a separate model for them.
- There's significant logic associated with these models outside of just validation.

Use **associations** when you can think of these models as two distinct things
that happen to be related to each other. For example, products are a distinct
concept from orders, but an address doesn't really make sense to store without
a user attached to it.

## Populating associated details for associated models

One limitation of association is that your API will only return ids without some additional instructions. In order to
return the full details of associated models, you need to `populate` them.

You can instruct Mongoose to populate associated details by appending a `populate` call to the end of your `find()` call,
and then calling `exec()` after it:

```javascript
Model.find().populate('associated_key').exec()
.then(docs => res.send(docs));
```

Population can be a bit "expensive", since your app needs to make multiple calls to MongoDB, so only use it when you need the information for the frontend.

You can populate multiple models by separating them with spaces, and nested models with `.`:

```javascript
Post.find().populate('user comments.user').exec()
.then(docs => res.send(docs));
```

## Modelling a one-to-one association using nesting
Let's try to model a simple relationship using nesting. We're going to be working
through the Address Book exercise to do this, find the code [here](https://github.com/HackerYou/con-ed-full-stack/tree/address-starter). This app allows users to maintain
a list of addresses for people ("Contact") and companies ("Company"). Right
now you can just add a name, but let's add the ability to add an address.

With this sort of simple relationship, nesting is an appropriate choice for a few
reasons:

- Contacts and companies don't need to share addresses (a contact and a Company
  might happen to have the same address, but it still makes sense to store this
  in separate records so we can edit each one independently).
- We never need to reference an address independently of a contact or a company.
- Contacts and Companies both have addresses, so it makes sense to have something
  separate that manages validation, schema, etc. for addresses so we don't duplicated
  anything.

Let's start by defining a **schema** for addresses. Add a new file named `address-schema.js`
to this project:

```javascript
// api/address-schema.js
const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  address: String,
  city: String,
  province: String,
  country: String,
  postalCode: String
});

module.exports = AddressSchema;
```

This looks like a model file with one exception - rather than exporting the results
of `mongoose.model`, we're directly exporting the schema. Because we're nesting the
data, we don't want to tell Mongoose to create a new model for us (which would store
addresses in a different collection), but instead we just want the schema available.

Next, we need to tell Contact and Company to use this schema. Add the following property
to both files:

```javascript
// api/company-model.js
const AddressSchema = require('./address-schema');
const CompanySchema = new mongoose.Schema({
  name: String,
  address: AddressSchema
});
```

```javascript
// api/contact-model.js
const AddressSchema = require('./address-schema');

const ContactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: AddressSchema
});
```

This tells Mongoose that there should be an address "nested" in both companies and 
contacts.

### Modifying addresses through schemas

Our models are aware that they have addresses, but they don't have any data
yet. Let's add an editor to allow modifying nested data.

First, let's add a new **component** to edit addresses. In the file called `AddressEditor.js` add the following code:

```javascript
//AddressEditor.js
import React from 'react';
import Field from './Field';

const AddressEditor = ({ address, onChange }) => (
  <div>
    <Field
      name="address"
      label="Address"
      value={address.address}
      onChange={onChange}
    />
    <Field name="city" label="City" value={address.city} onChange={onChange} />
    <Field
      name="province"
      label="State / Province"
      value={address.province}
      onChange={onChange}
    />
    <Field
      name="country"
      label="Country"
      value={address.country}
      onChange={onChange}
    />
    <Field
      name="postalCode"
      label="Zip / Postal Code"
      value={address.postalCode}
      onChange={onChange}
    />
  </div>
);

export default AddressEditor;
```

1. Add address state and implement the `updateAddressField` function in `<AddContact>`. This function updating the address
   part of the state specifically:

   ```javascript
   //AddContact.js 
  const [address, setAddress] = useState({});
  const updateAddressField = e => {
    const addressState = address;
    addressState[e.target.name] = e.target.value;
    setAddress(addressState);
  };
   ```

2. Note that this component expects to receive an `address` and `onChange` prop. Let's
modify `AddContact.js` to add this data:

Add the props to `<AddressEditor />` in `<AddContact />`:

   ```javascript
   //AddContact.js
    <AddressEditor address={address} onChange={updateAddressField} />
   ```

3. Modify the  `addRecord` function to include the address field in the body:

   ```javascript
   //AddContact.js
 
   const addRecord = async e => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Add address here:
        body: JSON.stringify({ firstName, lastName, address })
      });
   ```

Try it yourself. Follow the steps above to add the same functionality to the `<AddCompany>` component.

Try creating some new records. You won't be able to see the addresses yet, but
if you save something and access your API directly, you should see the data 
populated for both Companies and Contacts.

One great thing about nesting is that we didn't need to touch our controller to
get this functionality working - because an address is just part of a model,
as long as we're sending data, everything should update OK.

Showing an address is easy too, we just need to access the `address` property
on our contacts and companies:

1. Modify `Address.js` to return the following JSX:

```javascript
    import React from 'react';

  const Address = ({ address }) => {
    if (address) {
      return (
        <div>
          <div>{address.address}</div>
          <div>
            {address.city}, {address.province}, {address.country}
          </div>
          <div>{address.postalCode}</div>
        </div>
      );
    } else {
      return <div>(no address)</div>;
    }
};

export default Address;
```

2. Use the `<Address />` component in the Company and Contact components:

```javascript
//Company.js and Contact.js
    <div className='address'>
      <Address address={address}/>
    </div>
   ```

That's all there is to it! Nesting can be very useful when you have simple relationships.

To view the finished code, checkout [this repo](https://github.com/HackerYou/con-ed-full-stack/tree/address-finished). 

## Modelling Comments and Users in Fakebook
Let's look at another example - the "Fakebook" exercise. In this example we want 
to allow posts to have both comments and users.

You can download [the starter files here](https://github.com/HackerYou/con-ed-full-stack/tree/fakebook-starter)! 

This app displays posts and comments from users. Let's figure how to model this data.

### Thinking about the right association

For **comments** there's a few approaches we could take:

- We could **nest** comments inside of posts, so each post had an array of comments.
- We could add a **post id** to a new comment model.
- We could embed an **array of comment ids** in our post model.

In this case the "right" answer is less clear cut. Comments are definitely "part"
of a post, so nesting can work here. It's possible we might want to deal with 
comments separately from posts, but that's not necessary for our requirements right now.

If we decided to associate, deciding where to put the ids is often a tough choice. 
Let's look at some advantages and disadvantages:

- If we add a post id to comments, it wouldn't be simple to retrieve comments
  and posts from the same API endpoint. This could complicate our front end.
- Adding an array of comment ids to posts opens up some potential bugs - it
  would be technically possible for a comment to be associated with multiple
  posts, which doesn't seem right.
- Operations like deleting comments might be harder if posts have a list of comment
  ids.

For now, we're going to stick with nesting, since our requirements don't require
the extra work of associating.

First, let's create a comment schema. Add this to your Post model's file:

```javascript
// api/post-model.js
const CommentSchema = new mongoose.Schema({
  body: String
});
```

Then add an array of Comments in your Post model:

```javascript
// api/post-model.js
const PostSchema = new mongoose.Schema({
  body: String,
  comments: [CommentSchema]
});
```

Once we've added our comments, we just need to render them from our app. Because comments are embedded, just like with addresses, we don't need any additional logic:

1. Add this code to the `Comment` component:

   ```javascript
   // Comment.js
    import React from 'react';

    const Comment = ({body}) => (
      <div className='comment'>
        <div className='comment-body'>{body}</div>
      </div>
    )

    export default Comment;
   ```

2. Render your comments from the `Post` component. You'll need to add some comments
   through your import script (the 'finish' version of the exercise has comments
   added)

   ```javascript
   // Post.js
   import Comment from './Comment.js';
   //...
   const Post = ({ body, comments }) => (
  // ...
    <div>{comments.map(comment => <Comment key={comment._id} {...comment} /> )}</div>
   ```

### Adding users - using associations

Unlike comments, users probably need to be added through an association:

- Users probably need to be accessed independently of posts.
- The same user can be associated with multiple posts and comments.

Let's add an association through a new model.

In the file `user-model.js` add the following:

```javascript
// api/user-models.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('User', UserSchema);
```

Now we need to add a new association in the Post model:

```javascript
// api/post-model.js
require('./user-model.js');
const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  body: String,
  comments: [CommentSchema]
});
```

### Seed the database
We haven't created any UI to add posts or comments to this app so we are going to 'seed' data into our database. To do this, navigate into the `api` folder in the terminal and run the following:

```shell
$ node seeds.js
```

This will populate the database with several posts and comments.

Let's try outputting the user in our Post component:

```javascript
// Post.js
const Post = ({ body, comments, user }) => (
// ...
<div className='userName'>{user}</div>
```

We can now see the user, but it's just an id string - that's not very useful!

Anytime you want to add information from an associated model, you need to `populate`
it. Add the following to your Post controller:

```javascript
// api/post-controller.js
Post.find().populate('user').exec()
```
This will populate the user for both the comments and the post.

Voila! Users are appearing on the posts! Try doing the same thing for comments.

The completed code, can be found [here](https://github.com/HackerYou/con-ed-full-stack/tree/fakebook-finished). 