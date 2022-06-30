const mongoose = require('mongoose');

const gameDataSchema = mongoose.Schema({
   roomId: {
    type: String,
  } ,
  users:[{type:mongoose.Schema.Types.ObjectId}],
  gameData:{type:Object}
});
const GameDataSchema = mongoose.model('Gamedata', gameDataSchema);
module.exports = GameDataSchema;