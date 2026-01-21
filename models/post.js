const getDB = require('../db/database').getDB;

class Post {
  constructor(title, content, imageURL) {
    this.title = title;
    this.content = content;
    this.imageURL = imageURL;
  }

  save() {
    const db = getDB();
    return db.collection('posts').insertOne(this)
      .then(result => {
        console.log('14',result);
      })
      .catch(err => {
        console.error(err);
      })
  }
}

module.exports = Post;