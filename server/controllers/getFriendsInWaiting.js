const gamedata = require("../models/gamedata");

module.exports = async (req, res) => {
  try {
    const onlinePlayers = await gamedata
      .find({ "users.1": { $exists: false } }, { roomId: 1, users: 1, _id: -1 })
      .populate("users", "username");
    res.status(200).json({ data: onlinePlayers });
  } catch (err) {
    res.status(401).json({ message: "Error fetching online friends" });
  }
};
