const mongodb = require('mongodb');

const getDB = require('../db/database').getDB;

class Post {
  constructor(title, content, imageURL, id) {
    this.title = title;
    this.content = content;
    this.imageURL = imageURL;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDB();
    let dbOp;
    if(this._id) {
      // update post
      dbOp = db.collection('posts').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this})
    } else {
      dbOp = db.collection('posts').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log('14',result);
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