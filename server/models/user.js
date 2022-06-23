const mongoose = require('mongoose');

const userschema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is a required'],
    trim: true,
    unique: true,
    // validate: {
    //     validator(v) {
    //     return /^[a-z0-9.@_-+*/]{3,10}$/.test(v);
    //     },
    //     message: (props) => `${props.value} is not a valid TTN mail`,
    //   },
    },
  password: {
    type: String,
    trim:true,
    required: [true,'password is required']
  } 
});
const Users = mongoose.model('Users', userschema);
module.exports = Users;