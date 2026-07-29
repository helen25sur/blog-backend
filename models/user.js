const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  avatarUrl: {
    type: String,
    required: true,
    default: 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Wayfarers&hairColor=Brown&facialHairType=Blank&clotheType=CollarSweater&clotheColor=Gray01&eyeType=Side&eyebrowType=SadConcerned&mouthType=Twinkle&skinColor=Pale'
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
},
  {
    timestamps: true
  },);

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');

// const getDB = require('../db/database').getDB;

// class User {
//   constructor(userName, email, avatarUrl) {
//     this.userName = userName;
//     this.email = email;
//     this.avatarUrl = avatarUrl;
//   }

//   save() {
//     const db = getDB();
//     return db.collection('users').insertOne(this)
//       .then(result => {
//         console.log('16 User', result);
//       })
//       .catch(err => {
//         console.error(err);
//       })
//   }

//   static findById(userId) {
//     const db = getDB();
//     return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.error(err);
//       })
//   }
// }

// module.exports = User;