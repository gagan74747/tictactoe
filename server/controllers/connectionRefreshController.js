const Gamedata = require('../models/gamedata');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const onConnectionRefresh = async (token,clientSocket) => {
try {
 if(!token)
 throw new Error('toLogin')   
const verifytoken = jwt.verify(token, 'iugiuvhgeliuvgeiuvgfeuvgeivg');
const rootuser = await User.findOne({ _id: verifytoken._id });
if (!rootuser) { throw new Error('toLogin'); }
const user_id = rootuser._id;
const gamedata = await Gamedata.findOne(
{users : { $in : [user_id]}});
if(!gamedata)
throw new Error('toHome');
clientSocket('joinRoom',gamedata.roomId,rootuser.username);
return 'rejoined';
}catch(err){
return err;
}}

module.exports = onConnectionRefresh;
