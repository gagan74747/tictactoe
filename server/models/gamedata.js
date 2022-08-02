const mongoose = require('mongoose');

const gameDataSchema = mongoose.Schema({
   roomId: {
    type: String,
  } ,
  users:{
    type:[{type:mongoose.Schema.Types.ObjectId}],
    ref:'Users'
  },
  gamedata:{type:Object},
  turn : {
    type :String,
    default : '',
  },
  gameType:String
    });
const GameDataSchema = mongoose.model('Gamedata', gameDataSchema);
module.exports = GameDataSchema;