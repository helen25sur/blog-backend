const mongodb = require('mongodb');

const getDB = require('../db/database').getDB;

class Post {
  constructor(title, content, imageURL, id, userId, userName) {
    this.title = title;
    this.content = content;
    this.imageURL = imageURL;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
    this.userName = userName;
  }

  save() {
    const db = getDB();
    let dbOp;
    console.log('17 Post', this._id);
    if(this._id) {
      // update post
      dbOp = db.collection('posts').updateOne({_id: this._id}, {$set: this})
    } else {
      dbOp = db.collection('posts').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log('26 Post', result);
      })
      .catch(err => {
        console.error(err);
      })
  }

  static getAll() {
    const db = getDB();
    return db.collection('posts').find().toArray()
      .then(posts => {
        // console.log(posts);
        return posts;
      })
      .catch(err => {
        console.error(err); 
      })
  }

  static findById(postId) {
    const db = getDB();
    return db.collection('posts').find({_id: new mongodb.ObjectId(postId)})
      .next()
      .then(post => {
        console.log(post);
        return post;
      })
      .catch(err => {
        console.error(err);
      })
  }

  static deleteById(postId) {
    const db = getDB();
    return db.collection('posts').deleteOne({_id: new mongodb.ObjectId(postId)})
      .then(result => {
        console.log('Deleted');
        console.log(result);
      })
      .catch(err => {
        console.error(err);
      })
  }
}

module.exports = Post;