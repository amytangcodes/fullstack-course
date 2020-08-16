'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose; // const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: {
    type: String,
  },
});
const Users = mongoose.model('users', userSchema);

const commentSchema = new Schema({
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
    ref: 'users',
  }
});
const Comment = mongoose.model('comments', commentSchema);

const url = 'mongodb://localhost:27017/hackeryou';

mongoose.connect(url, { useNewUrlParser: true })
  .then(async () => {
    console.log(`Connected to server: ${url}`);

    // const myFriend = new Users({
    //   firstName: 'Reese',
    //   lastName: 'Wimbly',
    // });
    // const friendDoc = await myFriend.save();
    const users = await Users.find();
    console.log(users);

    const myComment = new Comment({
      body: "I think you're awesome!",
      // date: '',
      user: '5ca0d434007d744f5f1d5a2b',
    });
    const commentDoc = await myComment.save();

    const comments = await Comment.find();
    console.log(comments);
  })
  .catch((err) => {
    console.error(err);
    throw err;
  });