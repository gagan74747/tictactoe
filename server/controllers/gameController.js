const Gamedata = require('../models/gamedata');

   const game = async (req, res) => {
    try {
    // const user_id=req.user_id;
    // const gamedata = await Gamedata.findOne(
    // {users : { $in : [user_id]}});
    // if(!gamedata)
    // return res.status(400).json({message:'Join room to play game'});
    // socket.join(gamedata.roomId);
    // socket.on("opponentTurnPayload", (arg) => {
    //     socket.to(gamedata.roomId).emit("message", arg);
    //   });
    //   socket.on("nextturn", () => {
    //     socket.to(gamedata.roomId).emit("setturn");
    //   });
    res.status(200).json({message:`hello`});
    }
   catch (err) {
   return res.status(401).json({ message: ` ${err}` });
}
}
module.exports = {game};