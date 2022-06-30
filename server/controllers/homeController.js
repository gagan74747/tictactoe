const Gamedata = require("../models/gamedata");

const home = async (req, res) => {
  try {
    const  user_id  = req.user_id;
    const gamedata = await Gamedata.findOne({ users: { $in: [user_id] } });
    console.log(gamedata);
    if (gamedata) {
    gamedata.users = gamedata.users.filter((user) => user.toString() !== user_id.toString());
   await gamedata.save();
    }
    res.status(200).json({ username: req.username });
  } catch (err) {
    return res.status(401).json({ message: ` ${err}` });
  }
};
module.exports = { home };
