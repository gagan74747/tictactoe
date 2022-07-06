const mongoose = require('mongoose');

const gameDataSchema = mongoose.Schema({
   roomId: {
    type: String,
  } ,
  users:[{type:mongoose.Schema.Types.ObjectId}],
  gamedata:{type:Object},
  turn : {
    type :String,
    default : '',
  }
});
const GameDataSchema = mongoose.model('Gamedata', gameDataSchema);
module.exports = GameDataSchema;