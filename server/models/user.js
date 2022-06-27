const mongoose = require('mongoose');

const userschema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is a required'],
    trim: true,
    unique: true,
    minLength:[5,'username must be minimum of 5 characters'],
    maxLength:[10,'username must be maximum of 10 characters'],
    validate: {
        validator(v) {
        return /(?=.*[a-z])(?=.*[0-9])(?=.*[!@#%_])/.test(v);
        },
        message: (props) => `Provide a valid username`,
      },
    },
  password: {
    type: String,
    trim:true,
    required: [true,'password is required']
  } 
});
const Users = mongoose.model('Users', userschema);
module.exports = Users;