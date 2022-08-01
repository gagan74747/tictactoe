const Gamedata = require('../models/gamedata');

const pushUserIntoRoom = async (req, res) => {
try {
const {roomId} = req.body;
const user_id = req.user_id;
if(!roomId)
return res.status(400).json({message:'roomId is required'});
const alreadyInGame = await Gamedata.findOne({users:{$in :[user_id]}})
if(alreadyInGame)
{
alreadyInGame.roomId===roomId ?  res.status(200).json({message:"room joined"}) : res.status(400).json({message:'User already joined in another room'});
return }
const gamedata = await Gamedata.findOne({roomId});
if(!gamedata){
const gamedata = new Gamedata({roomId});
gamedata.users.push(user_id);
await gamedata.save();   
return res.status(200).json({message:"room joined"});
}
if(gamedata.users.length === 2)
return res.status(400).json({message:'room full'});
gamedata.users.push(user_id);
await gamedata.save();
res.status(200).json({message:"room joined"});
}
catch (err) {
return res.status(401).json({ message: ` ${err}` });
}}
module.exports = {pushUserIntoRoom};
